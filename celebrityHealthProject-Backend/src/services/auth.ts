import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Request } from "express";
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
    console.log('Environment variables:', process.env); // Temporary debug line
    throw new Error('JWT secret is not defined');
}

// const secret = 'Tea, Earl Grey, Hot';

export const hashPassword = async (plainTextPassword: string) => {
    const saltRound = 12;
    const hash = await bcrypt.hash(plainTextPassword, saltRound);
    return hash;
}

// export const comparePasswords = async (plainTextPassword: string, hashPassword: string) => {
//     return await bcrypt.compare(plainTextPassword, hashPassword);
// }

export const comparePasswords = async (plainTextPassword: string, hashPassword: string) => {
    console.log('Plain Text Password:', plainTextPassword);
    console.log('Hashed Password:', hashPassword);
    return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const signUserToken = async (user: User) => {
    //console.log(user.userId)
    let token = jwt.sign(
        { userId: user.userId },
        secret,
        { expiresIn: '1hr' }
    );
    
    return token;
}

export const verifyToken = async (req: Request) => {
    // Get the Authorization header from the request
    const authHeader = req.headers.authorization;
    // If header exists, parse token from `Bearer <token>`
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // Verify the token and get the user
        try {
            let decoded: any = await jwt.verify(token, secret);
            return User.findByPk(decoded.userId);
        }
        catch (err) {
            console.error('Token verification failed:', err);
            return null;
        }
    }
    else {
        return null;
    }

}
