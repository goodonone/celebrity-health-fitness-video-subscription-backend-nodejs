import { Request, Response } from 'express';
// import { RequestWithUser } from '../types/custom';
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
//                 // Check if it's a Firebase error and handle user not found
//                 if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
//                     await auth.createUser({
//                         uid: req.user.userId,
//                         email: req.user.email,
//                         emailVerified: true
//                     });
//                 } else {
//                     // If it's not a user-not-found error, rethrow it
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
//             let errorMessage = 'Failed to create Firebase token';
            
//             // Add more specific error messages based on the error type
//             if (isFirebaseError(error)) {
//                 switch (error.code) {
//                     case 'auth/invalid-credential':
//                         errorMessage = 'Invalid Firebase credentials';
//                         break;
//                     case 'auth/invalid-uid':
//                         errorMessage = 'Invalid user ID format';
//                         break;
//                     default:
//                         errorMessage = `Firebase error: ${error.code}`;
//                 }
//             }

//             res.status(500).json({ 
//                 error: errorMessage,
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


export async function getFirebaseToken(req: Request, res: Response) {
    try {
      console.log('1. Incoming Request User:', {
        email: req.user?.email,
        userId: req.user?.userId,
        isGoogleAuth: req.user?.isGoogleAuth,
        tier: req.user?.tier
      });
  
      if (!req.user?.userId) {
        console.log('No userId provided in request');
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      // Check if user exists in Firebase and get their info
      let existingFirebaseUser = null;
      try {
        existingFirebaseUser = await auth.getUserByEmail(req.user.email);
        console.log('2. Existing Firebase User Found:', {
          email: existingFirebaseUser.email,
          firebaseUID: existingFirebaseUser.uid,
          providerData: existingFirebaseUser.providerData,
          customClaims: (await auth.getUser(existingFirebaseUser.uid)).customClaims
        });
      } catch (error) {
        console.log('3. No existing Firebase user found');
      }
  
      // Set up custom claims
      const customClaims = {
        email: req.user.email,
        userId: req.user.userId,
        isGoogleAuth: req.user.isGoogleAuth || false,
        tier: req.user.tier || 'basic'
      };
  
      console.log('4. Custom Claims to be set:', customClaims);
  
      try {
        // Check if user exists in Firebase
        try {
          await auth.getUser(req.user.userId);
          console.log('5. Found user in Firebase with userId:', req.user.userId);
        } catch (error) {
          // Create new user if not found
          if (isFirebaseError(error) && error.code === 'auth/user-not-found') {
            console.log('6. Creating new Firebase user with userId:', req.user.userId);
            await auth.createUser({
              uid: req.user.userId,
              email: req.user.email,
              emailVerified: true
            });
          } else {
            console.error('7. Error checking user:', error);
            throw error;
          }
        }
  
        // Create custom token
        const customToken = await auth.createCustomToken(req.user.userId, customClaims);
        console.log('8. Successfully created token for userId:', req.user.userId);
  
        res.json({
          firebaseToken: customToken,
          expiresIn: 3600
        });
      } catch (error) {
        console.error('9. Firebase operation failed:', error);
        let errorMessage = 'Failed to create Firebase token';
  
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
      console.error('10. Error in getFirebaseToken:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  // Use it in your getFirebaseToken function
  // Add this debug logging to your getFirebaseToken function:
