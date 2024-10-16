import { Request, RequestHandler, Response } from "express";
import {User} from "../models/user";
// import {Cart} from "../models/cart";
import {Payment} from "../models/payment";
import jwt from 'jsonwebtoken';
import { hashPassword, comparePasswords, signUserToken, verifyToken } from "../services/auth";
import { OAuth2Client } from 'google-auth-library';
import { Snowflake } from "nodejs-snowflake";

const idGenerator = new Snowflake({
    custom_epoch: 1725148800000,
    instance_id: 1
});

function generateSnowflakeId(): string {
    return idGenerator.getUniqueID().toString();
}

const secret = process.env.JWT_SECRET
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
    let newUser: User = req.body;

    // console.log(newUser)

    if (newUser.email && newUser.password) {
        let hashedPassword = await hashPassword(newUser.password);
        newUser.password = hashedPassword;
        let created = await User.create(newUser);

        // call createPayment
        let newPayment: Payment = req.body;
        newPayment.userId = created.userId;
        // newPayment.userId = user.userId;
        // if (newPayment.userId && newPayment.tier) {
            let payment = await Payment.create(newPayment);
            // res.status(201).json(created);
        // }
        // else {
        //     res.status(400).send();
        // }

        res.status(200).json({
            email: created.email,
            // password: created.password,
            ...payment.dataValues
        });
        // // Create a cart for the new user
        // // interface CartCreationAttributes extends Omit<Cart, 'cartId'> {}
        // let newCart = await Cart.create({
        //     userId: created.userId // Use the ID from the created user
        // }as any);
    }
    else {
        res.status(400).send('Email and password required');
    }
}

// export const googleAuth: RequestHandler = async (req, res) => {
//     try {
//         const { token } = req.body;
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.GOOGLE_CLIENT_ID
//         });
//         const payload = ticket.getPayload();
//         if (!payload) {
//             return res.status(400).json({ message: 'Invalid token' });
//         }

//         const { email, name, picture } = payload;

//         let user = await User.findOne({ where: { email } });

//         if (!user) {
//             // Create new user
//             user = await User.create({
//                 userId: generateSnowflakeId(), // Generate a new userId
//                 email: email ?? '',
//                 name: name ?? '',
//                 password: null,
//                 isGoogleAuth: true,
//                 imgUrl: picture ?? '',
//                 tier: 'Just Looking',
//                 paymentFrequency: 'monthly',
//                 dateOfBirth: '1900-01-01', // Provide a default date of birth as a string
//                 // Add other necessary fields with default values
//             });

//             // Create initial payment record
//             await Payment.create({
//                 userId: user.userId,
//                 tier: 'Just Looking',
//                 price: 0, 
//                 paymentType: 'subscription'
//             } as Payment);
//         }

//         // Generate JWT
//         const jwtToken = await signUserToken(user);

//         res.status(200).json({
//             email: user.email,
//             userId: user.userId,
//             tier: user.tier,
//             paymentFrequency: user.paymentFrequency,
//             token: jwtToken
//         });
//     } catch (error) {
//         console.error('Error during Google authentication:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// export const loginUser: RequestHandler = async (req, res, next) => {
//     console.log('Login request body:', req.body);

//     const { email, password } = req.body;
//     const user = await User.findOne({ where: { email: email.trim() } });

//     if (!user) {
//         return res.status(401).json({ message: 'User not found' });
//     }

//     // Look up user by their email
//     let existingUser: User | null = await User.findOne({ 
//         where: { email: req.body.email }
//     });

//     // If user exists, check that password matches
//     if (existingUser) {
//         console.log('Stored password:', existingUser.password);
//         console.log('Entered password:', req.body.password);

//         let passwordsMatch = await comparePasswords(req.body.password, existingUser.password);
//         console.log('Passwords match:', passwordsMatch);
//         // If passwords match, create a JWT
//         if (passwordsMatch) {
//             let token = await signUserToken(existingUser);
//             res.status(200).json({ "email": existingUser.email,
//                                     "userId":existingUser.userId, 
//                                     "tier":existingUser.tier, 
//                                     "billing":existingUser.paymentFrequency, 
//                                     token });
//         }
        
//         if (!passwordsMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
    
//         const token = await signUserToken(user);
//         res.status(200).json({ token });
//     }
//     else {
//         res.status(401).json('Invalid email');
//     }
// }

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

// export const loginUser: RequestHandler = async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ where: { email: email.trim() } });
  
//       if (!user) {
//         return res.status(401).json({ message: 'User not found' });
//       }
  
//       const passwordsMatch = await comparePasswords(password, user.password);
//       if (!passwordsMatch) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate access and refresh tokens
//       const accessToken = jwt.sign({ userId: user.userId }, secret, { expiresIn: '1hr' });
//       const refreshToken = jwt.sign({ userId: user.userId }, secret, { expiresIn: '30d' });
  
//       // Store refresh token in a secure HTTP-only cookie
//       res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
  
//       return res.status(200).json({
//         email: user.email,
//         userId: user.userId,
//         tier: user.tier,
//         billing: user.paymentFrequency,
//         accessToken,
//       });
//     } catch (error) {
//       console.error('Error during login:', error);
//       return res.status(500).json({ message: 'Internal server error' });
//     }
//   };

// export const loginUser: RequestHandler = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ where: { email: email.trim() } });

//         if (!user) {
//             return res.status(401).json({ message: 'User not found' });
//         }

//         const passwordsMatch = await comparePasswords(password, user.password);
//         if (!passwordsMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate access token
//         const token = await signUserToken(user);

//         return res.status(200).json({
//             email: user.email,
//             userId: user.userId,
//             tier: user.tier,
//             paymentFrequency: user.paymentFrequency,
//             token // This is the access token
//         });
//     } catch (error) {
//         console.error('Error during login:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

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

// export const updateUser: RequestHandler = async (req, res, next) => {
//     let user: User | null = await verifyToken(req);

//    // console.log(user)

//     if (!user){
//         return res.status(403).send(); //403 forbidden if user is not logged in 
//     }
    
//     console.log(user);
//     user.paymentFrequency = req.body.paymentFrequency;
//     user.price = req.body.price;
//     user.tier = req.body.tier;
//     user.save();
//     res.status(200).json(user);

// }
// export const updateUser2: RequestHandler = async (req, res, next) => {
//     let user: User | null = await verifyToken(req);

//    // console.log(user)

//     if (!user){
//         return res.status(403).send(); //403 forbidden if user is not logged in 
//     }
    
//     let userId = req.params.id;
//     let newProfile: User = req.body;
    
//     console.log(userId)
//     console.log(newProfile)

//     let userFound = await User.findByPk(userId);
    
//     if (userFound && userFound.userId == newProfile.userId
//         && newProfile.name ) {
//             if (userFound.userId == user.userId ) 
//             {    
//                 await User.update(newProfile, {
//                     where: { userId: userId }
//                 });
//                 res.status(200).json();
//             }
//             else{
//                 res.status(403).send();
//             }
//     }
//     else {
//         res.status(400).json();
//     }
// }

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


// export const checkUserExists: RequestHandler = async (req, res) => {
//   const { email } = req.params;

//   if (!email) {
//     return res.status(400).json({ error: 'Email is required' });
//   }

//   try {
//     const user = await User.findOne({ where: { email } });
//     res.json(!!user); // Returns true if user exists, false otherwise
//   } catch (error) {
//     console.error('Error checking user existence:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// ... rest of the file ...

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