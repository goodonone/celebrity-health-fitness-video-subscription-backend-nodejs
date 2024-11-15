// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth';
import { User } from '../models/user';
import { auth } from '../config/firebase.config';
// import { RequestWithUser } from '../types/custom';

// export const authMiddleware = async (
//     req: RequestWithUser,
//     res: Response, 
//     next: NextFunction
// ) => {
//     try {
//         const authHeader = req.headers.authorization;
        
//         if (!authHeader) {
//             return res.status(401).json({ error: 'No authorization header' });
//         }

//         const token = authHeader.split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ error: 'No token provided' });
//         }

//         // Use your existing verifyToken function
//         const user = await verifyToken(req);
        
//         if (!user) {
//             return res.status(401).json({ error: 'Invalid or expired token' });
//         }

//         // Attach user to request
//         req.user = {
//             userId: user.userId,
//             email: user.email,
//             isGoogleAuth: user.isGoogleAuth,
//             name: user.name,
//             tier: user.tier || 'Just Looking' 
//         };

//         next();
//     } catch (error) {
//         console.error('Auth middleware error:', error);
//         return res.status(500).json({ error: 'Authentication failed' });
//     }
// };

// export const firebaseAuthMiddleware = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         if (!req.user?.userId) {
//             return res.status(401).json({ error: 'User not authenticated' });
//         }

//         // Verify Firebase ID token if present
//         const firebaseToken = req.headers['firebase-auth-token'];
//         if (firebaseToken && typeof firebaseToken === 'string') {
//             try {
//                 // Only verify token if Firebase auth is already initialized
//                 if (!auth) {
//                     throw new Error('Firebase auth not initialized');
//                 }
//                 const decodedToken = await auth.verifyIdToken(firebaseToken);
//                 // Add Firebase user info to the request if needed
//                 req.user.firebaseUser = {
//                     uid: decodedToken.uid,
//                     email: decodedToken.email
//                 };
//             } catch (error) {
//                 console.error('Firebase token verification failed:', error);
//                 return res.status(403).json({ error: 'Invalid Firebase token' });
//             }
//         }

//         next();
//     } catch (error) {
//         console.error('Firebase auth middleware error:', error);
//         return res.status(500).json({ error: 'Firebase authentication failed' });
//     }
// };

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ 
        success: false, 
        error: 'Authorization header required' 
      });
      return;
    }

    // Validate Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid authorization format. Use Bearer token' 
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Token not provided' 
      });
      return;
    }

    // Verify token and get user
    const user = await verifyToken(req);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
      return;
    }

    // Attach user to request
    req.user = {
      userId: user.userId,
      email: user.email,
      isGoogleAuth: user.isGoogleAuth,
      name: user.name,
      tier: user.tier || 'Just Looking',
      imgUrl: user.imgUrl || undefined,
      dateOfBirth: user.dateOfBirth || undefined,
      gender: user.gender || undefined,
      weight: user.weight || undefined,
      height: user.height || undefined,
      goals: user.goals || undefined,
      profilePictureSettings: user.profilePictureSettings
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
      return;
    }

    // Verify Firebase ID token if present
    const firebaseToken = req.headers['firebase-auth-token'];
    if (firebaseToken && typeof firebaseToken === 'string') {
      try {
        if (!auth) {
          throw new Error('Firebase auth not initialized');
        }
        const decodedToken = await auth.verifyIdToken(firebaseToken);
        
        // Add Firebase user info to request
        req.user.firebaseUser = {
          uid: decodedToken.uid,
          email: decodedToken.email
        };
      } catch (error) {
        console.error('Firebase token verification failed:', error);
        res.status(403).json({ 
          success: false, 
          error: 'Invalid Firebase token' 
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Firebase authentication failed',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

// src/middlewares/auth.middleware.ts

// export const authMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const user = await verifyToken(req);
//     if (!user) {
//       res.status(401).json({ success: false, message: 'Authentication failed' });
//       return;
//     }

//     req.user = {
//       userId: user.userId,
//       email: user.email,
//       isGoogleAuth: user.isGoogleAuth,
//       name: user.name,
//       tier: user.tier || 'Just Looking',
//       // Include other properties as needed
//     };

//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     res.status(500).json({ error: 'Authentication failed' });
//   }
// };

// const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const user = await verifyToken(req);
//       if (!user) {
//         return res.status(401).json({ 
//           success: false, 
//           message: 'Authentication failed' 
//         });
//       }
  
//       // Transform the User model instance into UserData with proper type handling
//       req.user = transformUserToUserData(user);
//       next();
//     } catch (error) {
//       console.error('Auth middleware error:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   };