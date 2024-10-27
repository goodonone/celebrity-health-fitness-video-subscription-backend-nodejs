// // src/controllers/auth.controller.ts
// import { Request, Response } from 'express';
// import { RequestWithUser } from '../types/custom';
// import { auth } from '../config/firebase.config';

// export async function getFirebaseToken(req: RequestWithUser, res: Response) {
//     try {
//         if (!req.user?.userId) {
//             return res.status(401).json({ error: 'User not authenticated' });
//         }

//         // Create a custom token using the user's ID
//         const customToken = await auth.createCustomToken(req.user.userId, {
//             email: req.user.email,
//             isGoogleAuth: req.user.isGoogleAuth
//         });

//         res.json({ 
//             firebaseToken: customToken,
//             expiresIn: 3600 // Token expires in 1 hour
//         });
//     } catch (error) {
//         console.error('Error creating Firebase token:', error);
//         res.status(500).json({ 
//             error: 'Failed to create Firebase token',
//             details: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// }

// import { Request, Response } from 'express';
// import { RequestWithUser } from '../types/custom';
// import { auth } from '../config/firebase.config';

// export async function getFirebaseToken(req: RequestWithUser, res: Response) {
//     try {
//         if (!req.user?.userId) {
//             return res.status(401).json({ error: 'User not authenticated' });
//         }

//         // Add custom claims to the token
//         const customClaims = {
//             email: req.user.email,
//             userId: req.user.userId,
//             isGoogleAuth: req.user.isGoogleAuth || false,
//             tier: req.user.tier || 'basic'
//         };

//         try {
//             // First, ensure the user exists in Firebase
//             try {
//                 await auth.getUser(req.user.userId);
//             } catch (error) {
//                 // If user doesn't exist, create them
//                 if (error.code === 'auth/user-not-found') {
//                     await auth.createUser({
//                         uid: req.user.userId,
//                         email: req.user.email,
//                         emailVerified: true
//                     });
//                 } else {
//                     throw error;
//                 }
//             }

//             // Create custom token with claims
//             const customToken = await auth.createCustomToken(req.user.userId, customClaims);

//             res.json({ 
//                 firebaseToken: customToken,
//                 expiresIn: 3600 // Token expires in 1 hour
//             });
//         } catch (error) {
//             console.error('Firebase operation failed:', error);
//             res.status(500).json({ 
//                 error: 'Failed to create Firebase token',
//                 details: error instanceof Error ? error.message : 'Unknown error'
//             });
//         }
//     } catch (error) {
//         console.error('Error in getFirebaseToken:', error);
//         res.status(500).json({ 
//             error: 'Internal server error',
//             details: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// }

import { Request, Response } from 'express';
import { RequestWithUser } from '../types/custom';
import { auth } from '../config/firebase.config';
import { FirebaseAuthError } from 'firebase-admin/auth';

// Type guard to check if an error is a FirebaseError
function isFirebaseError(error: unknown): error is FirebaseAuthError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as FirebaseAuthError).code === 'string'
    );
}

export async function getFirebaseToken(req: RequestWithUser, res: Response) {
    try {
        if (!req.user?.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Add custom claims to the token
        const customClaims = {
            email: req.user.email,
            userId: req.user.userId,
            isGoogleAuth: req.user.isGoogleAuth || false,
            tier: req.user.tier || 'basic'
        };

        try {
            // First, ensure the user exists in Firebase
            try {
                await auth.getUser(req.user.userId);
            } catch (error) {
                // Check if it's a Firebase error and handle user not found
                if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
                    await auth.createUser({
                        uid: req.user.userId,
                        email: req.user.email,
                        emailVerified: true
                    });
                } else {
                    // If it's not a user-not-found error, rethrow it
                    throw error;
                }
            }

            // Create custom token with claims
            const customToken = await auth.createCustomToken(req.user.userId, customClaims);

            res.json({ 
                firebaseToken: customToken,
                expiresIn: 3600 // Token expires in 1 hour
            });
        } catch (error) {
            console.error('Firebase operation failed:', error);
            let errorMessage = 'Failed to create Firebase token';
            
            // Add more specific error messages based on the error type
            if (isFirebaseError(error)) {
                switch (error.code) {
                    case 'auth/invalid-credential':
                        errorMessage = 'Invalid Firebase credentials';
                        break;
                    case 'auth/invalid-uid':
                        errorMessage = 'Invalid user ID format';
                        break;
                    default:
                        errorMessage = `Firebase error: ${error.code}`;
                }
            }

            res.status(500).json({ 
                error: errorMessage,
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    } catch (error) {
        console.error('Error in getFirebaseToken:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}