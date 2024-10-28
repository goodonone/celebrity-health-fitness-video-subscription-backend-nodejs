import { Request, RequestHandler, Response } from "express";
import {User} from "../models/user";
// import {Cart} from "../models/cart";
// import {Payment} from "../models/payment";
// import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords, signUserToken, verifyToken } from "../services/auth";
import { OAuth2Client } from 'google-auth-library';
import { Snowflake } from "nodejs-snowflake";
import sgMail from '@sendgrid/mail';
import { Op, Transaction } from 'sequelize';
import crypto from 'crypto';
import { db } from './../models/index';
import { Payment } from "../models/payment"; 

const idGenerator = new Snowflake({
    custom_epoch: 1725148800000,
    instance_id: 1
});

function generateSnowflakeId(): string {
    return idGenerator.getUniqueID().toString();
}

const secret = process.env.JWT_SECRET
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

if(!secret) {
    throw new Error('JWT secret is not defined');
}

function sanitizeUser(user: User) {
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      tier: user.tier,
      billing: user.paymentFrequency,
      imgUrl: user.imgUrl,
      price: user.price,
      isGoogleAuth: user.isGoogleAuth,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      goals: user.goals,
      dateOfBirth: user.dateOfBirth,
      profilePictureSettings: user.profilePictureSettings,
    //   createdAt: user.createdAt,
    //   updatedAt: user.updatedAt
      // Add any other non-sensitive fields you want to include
    };
  }


export const createUser: RequestHandler = async (req, res, next) => {
    const t: Transaction = await db.transaction();

    try {
        let newUser: User = req.body;
        let paymentInfo = req.body;

        if (newUser.email && newUser.password) {
            let hashedPassword = await hashPassword(newUser.password);
            newUser.password = hashedPassword;
            
            let createdUser = await User.create(newUser, { transaction: t });

            let newPayment = {
                userId: createdUser.userId,
                tier: paymentInfo.tier || 'Just Looking',
                price: paymentInfo.price || 0,
                purchaseType: paymentInfo.paymentType || 'subscription',
                paymentFrequency: paymentInfo.paymentFrequency || 'monthly',
                billingAddress: paymentInfo.billingAddress,
                billingZipcode: paymentInfo.billingZipcode,
                shippingAddress: paymentInfo.shippingAddress,
                shippingZipcode: paymentInfo.shippingZipcode
            };

            let createdPayment = await Payment.create(newPayment, { transaction: t });

            await t.commit();

            res.status(201).json({
                user: {
                    userId: createdUser.userId,
                    email: createdUser.email,
                    name: createdUser.name,
                    tier: createdUser.tier,
                    paymentFrequency: createdUser.paymentFrequency,
                    price: createdUser.price,
                },
                payment: createdPayment
            });
        } else {
            await t.rollback();
            res.status(400).send('Email and password required');
        }
    } catch (error) {
        await t.rollback();
        console.error('Error creating user and payment:', error);
        res.status(500).json({ message: 'Error creating user and payment' });
    }
}

export const loginUser: RequestHandler = async (req, res) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Find the user by email, and trim any extra spaces from the email
        const user = await User.findOne({ where: { email: email.trim() } });

        // If user is not found, return 401 status with a 'User not found' message
        if (!user) {
            return res.status(401).json({ message: 'User not found. Please sign up first.' });
        }

        if (user.password === null) {
            return res.status(401).json({ message: 'Invalid login method. Please use Google Sign-In.' });
        }

        // Debug: Log the stored hashed password and the entered plain password
        // console.log('Stored password:', user.password);
        // console.log('Entered password:', password);

        // Compare the entered password with the stored hashed password
        const passwordsMatch = await comparePasswords(password, user.password);
        // console.log('Passwords match:', passwordsMatch);

        // If passwords do not match, return 401 status with an 'Invalid credentials' message
        if (!passwordsMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token for the authenticated user
        const token = await signUserToken(user);

        // Return user information and the token
        return res.status(200).json({
            ...sanitizeUser(user),
            token
        });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
    let users = await User.findAll();
    res.status(200).json(users);
}

export const getUser: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user){
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }

    let userId = req.params.id;
    let userFound = await User.findByPk(userId);

    // console.log(user)
    // console.log(userId)


    // let user: User | null = await verifyToken(req);
    if (userFound && userFound.userId === user.userId) {
        res.status(200).json(sanitizeUser(userFound));
    }
    else {
        res.status(404).json({});
    }
}

export const updateUser: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user) {
        return res.status(403).send(); // 403 forbidden if user is not logged in
    }

    const userId = req.params.id;
    const updateData: Partial<User> = req.body;

    // console.log('User ID:', userId);
    // console.log('Update data:', updateData);

    try {
        const userToUpdate = await User.findByPk(userId);

        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToUpdate.userId !== user.userId) {
            return res.status(403).json({ message: 'Unauthorized to update this user' });
        }

        // Fields that can be updated
        const updatableFields: (keyof User)[] = [
            'email', 'name', 'weight', 'height', 'gender',
            'goals', 'tier', 'dateOfBirth', 'price', 'paymentFrequency', 'profilePictureSettings'
        ];

        // updatableFields.forEach((field) => {
        //     if (updateData[field] !== undefined) {
        //         (userToUpdate as any)[field] = updateData[field];
        //     }
        updatableFields.forEach((field) => {
            if (updateData.hasOwnProperty(field)) {
                (userToUpdate as any)[field] = updateData[field];
            }
        });
        // });

        // Handle imgUrl separately
        // if (updateData.imgUrl) {
        //     userToUpdate.imgUrl = updateData.imgUrl;
        // }
        // Handle imgUrl separately
        if (updateData.hasOwnProperty('imgUrl')) {
            userToUpdate.imgUrl = updateData.imgUrl!;
        }

        await userToUpdate.save();

        // Create a new object with only the fields we want to send back
        const userResponse = sanitizeUser(userToUpdate);

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user){
        return res.status(403).send(); //403 forbidden if user is not logged in 
    }

    let userId = req.params.id;
    let userFound = await User.findByPk(userId);
    
    if (userFound) {
        if (userFound.userId === user.userId ) 
        {
            await User.destroy({
                    where: { userId: userId }
            });
            res.status(200).json();
        }
        else{
            res.status(403).send();
        }
    }
    else {
        res.status(404).json();
    }
}

export const checkEmail: RequestHandler = async (req, res, next) => {
    const { email } = req.body;
    // console.log('Email received:', email); // Debug log

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(200).json({ exists: true, message: 'Email already exists' });
        } else {
            return res.status(200).json({ exists: false, message: 'Email is available' });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}


export const checkPassword: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user) {
        return res.status(403).send(); // 403 forbidden if user is not logged in 
    }

    const { password } = req.body;
    const userId = req.params.id;

    if (user.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        if(user.password === null) {
            return res.status(400).json({ message: 'User does not have a password set' });
        }

        const isMatch = await comparePasswords(password, user.password);
        res.json(isMatch);
    } catch (error) {
        console.error('Error checking password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const updatePassword: RequestHandler = async (req, res, next) => {
    let user: User | null = await verifyToken(req);

    if (!user) {
        return res.status(403).send(); // 403 forbidden if user is not logged in 
    }

    const { newPassword } = req.body;
    const userId = req.params.id;

    if (user.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const requestPasswordReset: RequestHandler = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


      // Check if the user is a Google OAuth user
    if (user.isGoogleAuth) {
        // Send a different email for Google OAuth users
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL!,
          templateId: 'd-8610d03ffbc84e4e942f3cdc5521a8ed', 
          dynamicTemplateData: {
            name: user.name,
            loginUrl: `${process.env.FRONTEND_URL}/login` 
          }
        };
  
        await sgMail.send(msg);
  
        return res.status(200).json({ 
          message: 'Instructions sent for Google account login',
          isOAuthUser: true
        });
    }   

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM_EMAIL!,
            templateId: 'd-ddc19436e7f34a478444b6576038e3f7',
            dynamicTemplateData: {
              resetUrl: resetUrl
            }
          };

        await sgMail.send(msg);

        res.status(200).json({ message: 'Reset password instructions sent' });
    } catch (error) {
        console.error('Error in reset password request:', error);
        res.status(500).json({ message: 'Error in reset password request process' });
    }
};

export const resetPassword: RequestHandler = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password has been reset' });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({ message: 'Error in reset password process' });
    }
};
