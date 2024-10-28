// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { User } from '../models/user';
// import { Request } from "express";
// import dotenv from 'dotenv';

// dotenv.config();

// const secret = process.env.JWT_SECRET;
// if (!secret) {
//     console.log('Environment variables:', process.env); // Temporary debug line
//     throw new Error('JWT secret is not defined');
// }

// // Define types for JWT payload
// interface JWTPayload {
//     userId: string;
//     iat?: number;
//     exp?: number;
// }

// // Define return type for verifyToken
// interface VerifiedUser {
//     userId: string;
//     firebaseUser?: {
//         uid: string;
//         email?: string;
//     };
//     [key: string]: any;
// }

// export const hashPassword = async (plainTextPassword: string) => {
//     const saltRound = 12;
//     const hash = await bcrypt.hash(plainTextPassword, saltRound);
//     return hash;
// }

// // export const comparePasswords = async (plainTextPassword: string, hashPassword: string) => {
// //     return await bcrypt.compare(plainTextPassword, hashPassword);
// // }

// export const comparePasswords = async (plainTextPassword: string, hashPassword: string) => {
//     // console.log('Plain Text Password:', plainTextPassword);
//     // console.log('Hashed Password:', hashPassword);
//     return await bcrypt.compare(plainTextPassword, hashPassword);
// };

// export const signUserToken = async (user: User) => {
//     //console.log(user.userId)
//     let token = jwt.sign(
//         { userId: user.userId },
//         secret,
//         { expiresIn: '1hr' }
//     );
    
//     return token;
// }

// export const verifyToken = async (req: Request) => {
//     // Get the Authorization header from the request
//     const authHeader = req.headers.authorization;
//     // If header exists, parse token from `Bearer <token>`
//     if (authHeader) {
//         const token = authHeader.split(' ')[1];
//         // Verify the token and get the user
//         try {
//             let decoded: any = await jwt.verify(token, secret);
//             return User.findByPk(decoded.userId);
//         }
//         catch (err) {
//             console.error('Token verification failed:', err);
//             return null;
//         }
//     }
//     else {
//         return null;
//     }

// }

// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { User } from '../models/user';
// import { Request } from "express";
// import dotenv from 'dotenv';

// dotenv.config();

// const secret = process.env.JWT_SECRET;
// if (!secret) {
//     console.log('Environment variables:', process.env); // Temporary debug line
//     throw new Error('JWT secret is not defined');
// }

// // Define types for JWT payload
// interface JWTPayload {
//     userId: string;
//     iat?: number;
//     exp?: number;
// }

// // Define return type for verifyToken
// interface VerifiedUser {
//     userId: string;
//     firebaseUser?: {
//         uid: string;
//         email?: string;
//     };
//     [key: string]: any;
// }

// export const hashPassword = async (plainTextPassword: string): Promise<string> => {
//     const saltRound = 12;
//     const hash = await bcrypt.hash(plainTextPassword, saltRound);
//     return hash;
// }

// export const comparePasswords = async (
//     plainTextPassword: string, 
//     hashPassword: string
// ): Promise<boolean> => {
//     return await bcrypt.compare(plainTextPassword, hashPassword);
// };

// export const signUserToken = async (user: User): Promise<string> => {
//     const token = jwt.sign(
//         { userId: user.userId } as JWTPayload,
//         secret,
//         { expiresIn: '1hr',
//           algorithm: 'HS256'
//          }
//     );
    
//     return token;
// }

// // export const verifyToken = async (req: Request): Promise<User | null> => {
// //     const authHeader = req.headers.authorization;

// //     if (authHeader) {
// //         const token = authHeader.split(' ')[1];
        
// //         try {
// //             const decoded = jwt.verify(token, secret) as JWTPayload;
            
// //             if (!decoded.userId) {
// //                 console.error('Token payload missing userId');
// //                 return null;
// //             }

// //             return await User.findByPk(decoded.userId);
// //         }
// //         catch (err) {
// //             console.error('Token verification failed:', err);
// //             return null;
// //         }
// //     }
    
// //     return null;
// // }
// export const verifyToken = async (req: Request): Promise<User | null> => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader?.startsWith('Bearer ')) {
//             return null;
//         }

//         const token = authHeader.split(' ')[1];
        
//         // Verify token with explicit algorithm
//         const decoded = jwt.verify(token, secret, {
//             algorithms: ['HS256'] // Explicitly specify allowed algorithms
//         }) as JWTPayload;
        
//         if (!isJWTPayload(decoded)) {
//             console.error('Invalid token payload structure');
//             return null;
//         }

//         const user = await User.findByPk(decoded.userId);
//         if (!user) {
//             console.error('User not found for token payload:', decoded);
//             return null;
//         }

//         return user;
//     } catch (err) {
//         console.error('Token verification failed:', err);
//         return null;
//     }
// }

// // Type guard to check if an object is a valid JWTPayload
// function isJWTPayload(payload: any): payload is JWTPayload {
//     return typeof payload === 'object' && 
//            'userId' in payload && 
//            typeof payload.userId === 'string';
// }

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from "express";
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;
if (!secret) {
    console.log('Environment variables:', process.env); // Temporary debug line
    throw new Error('JWT secret is not defined');
}

// Define types for JWT payload
interface JWTPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

// Define return type for verifyToken
interface VerifiedUser {
    userId: string;
    firebaseUser?: {
        uid: string;
        email?: string;
    };
    [key: string]: any;
}

export const hashPassword = async (plainTextPassword: string): Promise<string> => {
    const saltRound = 12;
    const hash = await bcrypt.hash(plainTextPassword, saltRound);
    return hash;
}

export const comparePasswords = async (
    plainTextPassword: string, 
    hashPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainTextPassword, hashPassword);
};

export const signUserToken = async (user: User): Promise<string> => {
    const token = jwt.sign(
        { userId: user.userId } as JWTPayload,
        secret,
        { 
            expiresIn: '1hr',
            algorithm: 'HS256'  // Explicitly specify the algorithm
        }
    );
    
    return token;
}

export const verifyToken = async (req: Request): Promise<User | null> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            console.log('No Bearer token found in authorization header');
            return null;
        }

        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, secret, {
                algorithms: ['HS256']  // Explicitly specify the allowed algorithms
            }) as JWTPayload;
            
            if (!decoded.userId) {
                console.error('Token payload missing userId');
                return null;
            }

            // Log successful token verification
            console.log('Token verified successfully for userId:', decoded.userId);

            const user = await User.findByPk(decoded.userId);
            
            if (!user) {
                console.error('User not found for userId:', decoded.userId);
                return null;
            }

            return user;
        }
        catch (err) {
            console.error('Token verification failed:', err);
            return null;
        }
    } catch (error) {
        console.error('Error in verifyToken:', error);
        return null;
    }
}

// Type guard to check if an object is a valid JWTPayload
function isJWTPayload(payload: any): payload is JWTPayload {
    return typeof payload === 'object' && 
           'userId' in payload && 
           typeof payload.userId === 'string';
}