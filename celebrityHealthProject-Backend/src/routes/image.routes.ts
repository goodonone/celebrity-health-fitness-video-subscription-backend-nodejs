// import { Router } from 'express';
// import { ImageController } from '../controllers/image.controller';
// import { verifyToken } from '../services/auth';
// import { Request, Response, NextFunction } from 'express';


// const router = Router();

// // Middleware to verify token and attach user to requestconst authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const user = await verifyToken(req);
//             if (!user) {
//                 return res.status(401).json({ message: 'Not authorized' });
//             }
//             req.user = user;
//             next();
//         } catch (error) {
//             console.error('Auth middleware error:', error);
//             res.status(500).json({ message: 'Server Error' });
//         }
//     };

// // Apply auth middleware to all routes
// router.use(authMiddleware);

// // Routes
// router.post('/upload-url/:userId', ImageController.getUploadUrl);
// router.put('/profile-picture/:userId', ImageController.updateProfilePicture);
// router.delete('/profile-picture/:userId', ImageController.deleteProfilePicture);

// // Add user verification middleware
// router.use('/:userId', (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user || req.user.userId !== req.params.userId) {
//         return res.status(403).json({ message: 'Not authorized to modify this user' });
//     }
//     next();
// });

// export default router;

// import { Router } from 'express';
// import { ImageController } from '../controllers/image.controller';
// import { verifyToken } from '../services/auth';
// import { Response, NextFunction } from 'express';
// import { RequestWithUser } from '../types/custom';

// const router = Router();

// // Middleware to verify token and attach user to request
// // const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     try {
// //         const verifiedUser = await verifyToken(req);
// //         if (!verifiedUser) {
// //             return res.status(401).json({ message: 'Not authorized' });
// //         }

// //         // Transform the Sequelize User instance into UserData
// //         req.user = {
// //             userId: verifiedUser.userId,
// //             email: verifiedUser.email,
// //             isGoogleAuth: verifiedUser.isGoogleAuth,
// //             name: verifiedUser.name,
// //             tier: verifiedUser.tier || 'Just Looking',
// //             weight: verifiedUser.weight || undefined,
// //             height: verifiedUser.height || undefined,
// //             gender: verifiedUser.gender || undefined,
// //             goals: verifiedUser.goals || undefined,
// //             dateOfBirth: verifiedUser.dateOfBirth || undefined,
// //             imgUrl: verifiedUser.imgUrl || undefined
// //         };

// //         next();
// //     } catch (error) {
// //         console.error('Auth middleware error:', error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // };
// // const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     try {
// //         // Extract the token from the Authorization header
// //         const authHeader = req.headers.authorization;
// //         if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //             return res.status(401).json({ message: 'No auth token provided' });
// //         }

// //         // Verify the token using the existing verifyToken function
// //         const verifiedUser = await verifyToken(req);
// //         if (!verifiedUser) {
// //             return res.status(401).json({ message: 'Not authorized' });
// //         }

// //         req.user = {
// //             userId: verifiedUser.userId,
// //             email: verifiedUser.email,
// //             isGoogleAuth: verifiedUser.isGoogleAuth,
// //             name: verifiedUser.name,
// //             tier: verifiedUser.tier || 'Just Looking',
// //             weight: verifiedUser.weight || undefined,
// //             height: verifiedUser.height || undefined,
// //             gender: verifiedUser.gender || undefined,
// //             goals: verifiedUser.goals || undefined,
// //             dateOfBirth: verifiedUser.dateOfBirth || undefined,
// //             imgUrl: verifiedUser.imgUrl || undefined
// //         };

// //         next();
// //     } catch (error) {
// //         console.error('Auth middleware error:', error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // };

// // const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     try {
// //         // Extract and validate the Bearer token
// //         const authHeader = req.headers.authorization;
// //         if (!authHeader?.startsWith('Bearer ')) {
// //             return res.status(401).json({ 
// //                 success: false, 
// //                 message: 'Authentication token missing or invalid format' 
// //             });
// //         }

// //         // Verify the token and get user data
// //         const verifiedUser = await verifyToken(req);
// //         if (!verifiedUser) {
// //             return res.status(401).json({ 
// //                 success: false, 
// //                 message: 'Invalid or expired authentication token' 
// //             });
// //         }

// //         // Attach verified user data to request
// //         req.user = {
// //             userId: verifiedUser.userId,
// //             email: verifiedUser.email,
// //             isGoogleAuth: verifiedUser.isGoogleAuth,
// //             name: verifiedUser.name,
// //             tier: verifiedUser.tier || 'Just Looking',
// //             weight: verifiedUser.weight || undefined,
// //             height: verifiedUser.height || undefined,
// //             gender: verifiedUser.gender || undefined,
// //             goals: verifiedUser.goals   || undefined,
// //             dateOfBirth: verifiedUser.dateOfBirth,
// //             imgUrl: verifiedUser.imgUrl || undefined
// //         };

// //         next();
// //     } catch (error) {
// //         console.error('Authentication middleware error:', error);
// //         res.status(500).json({ 
// //             success: false, 
// //             message: 'Authentication failed due to server error',
// //             error: error instanceof Error ? error.message : 'Unknown error'
// //         });
// //     }
// // };

// // const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     try {
// //         const user = await verifyToken(req);
// //         if (!user) {
// //             return res.status(401).json({ 
// //                 success: false, 
// //                 message: 'Authentication failed' 
// //             });
// //         }

// //         // Store the entire user object
// //         req.user = user;
// //         next();
// //     } catch (error) {
// //         console.error('Auth middleware error:', error);
// //         res.status(500).json({ message: 'Server error' });
// //     }
// // };

// // const userMatchMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     const paramUserId = req.params.userId;
// //     const userIdFromToken = req.user?.userId;

// //     console.log('Comparing user IDs:', { paramUserId, userIdFromToken });

// //     if (!userIdFromToken || userIdFromToken.toString() !== paramUserId.toString()) {
// //         return res.status(403).json({
// //             success: false,
// //             message: 'Not authorized to access this resource'
// //         });
// //     }

// //     next();
// // };

// const transformUserToUserData = (user: User): UserData => {
//     return {
//         userId: user.userId,
//         email: user.email,
//         isGoogleAuth: user.isGoogleAuth || false,
//         name: user.name || '',
//         tier: user.tier || 'Just Looking',
//         weight: user.weight || undefined,
//         height: user.height || undefined,
//         gender: user.gender || undefined,
//         goals: user.goals || undefined,
//         dateOfBirth: user.dateOfBirth || undefined,
//         imgUrl: user.imgUrl || undefined
//     };
// };

// const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//         const user = await verifyToken(req);
//         if (!user) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Authentication failed' 
//             });
//         }

//         // Transform the User model instance into UserData
//         req.user = transformUserToUserData(user);
//         next();
//     } catch (error) {
//         console.error('Auth middleware error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const userMatchMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
//     const paramUserId = req.params.userId;
//     const userIdFromToken = req.user?.userId;

//     console.log('Comparing user IDs:', { paramUserId, userIdFromToken });

//     if (!userIdFromToken || userIdFromToken.toString() !== paramUserId.toString()) {
//         return res.status(403).json({
//             success: false,
//             message: 'Not authorized to access this resource'
//         });
//     }

//     next();
// };

// const validateUploadRequest = (req: RequestWithUser, res: Response, next: NextFunction) => {
//     const { contentType } = req.body;
    
//     if (!contentType) {
//         return res.status(400).json({
//             success: false,
//             message: 'Content type is required'
//         });
//     }

//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!allowedTypes.includes(contentType)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid content type. Allowed types: JPEG, PNG, GIF'
//         });
//     }

//     next();
// };

// // Apply auth middleware to all routes
// router.use(authMiddleware);

// // Add user verification middleware
// // const userVerificationMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     if (!req.user || req.user.userId !== req.params.userId) {
// //         return res.status(403).json({ message: 'Not authorized to modify this user' });
// //     }
// //     next();
// // };
// const userVerificationMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
//     const requestedUserId = req.params.userId;
//     const authenticatedUserId = req.user?.userId;

//     if (!authenticatedUserId || authenticatedUserId !== requestedUserId) {
//         return res.status(403).json({ 
//             success: false,
//             message: 'You are not authorized to perform this action for the requested user'
//         });
//     }

//     next();
// };

// // const validateUploadRequest = (req: RequestWithUser, res: Response, next: NextFunction) => {
// //     const { contentType } = req.body;
    
// //     if (!contentType) {
// //         return res.status(400).json({
// //             success: false,
// //             message: 'Content type is required'
// //         });
// //     }

// //     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
// //     if (!allowedTypes.includes(contentType)) {
// //         return res.status(400).json({
// //             success: false,
// //             message: 'Invalid content type. Allowed types: JPEG, PNG, GIF'
// //         });
// //     }

// //     next();
// // };


// router.use('/:userId', userVerificationMiddleware);


// // router.post('/upload-url/:userId', authMiddleware, userVerificationMiddleware, ImageController.getUploadUrl);
// // router.put('/profile-picture/:userId', ImageController.updateProfilePicture);
// // router.delete('/profile-picture/:userId', ImageController.deleteProfilePicture);

// // Routes with appropriate middleware chains
// router.post('/upload-url/:userId', 
//     userMatchMiddleware,
//     validateUploadRequest,
//     ImageController.getUploadUrl
// );

// router.put('/profile-picture/:userId',
//     userMatchMiddleware,
//     ImageController.updateProfilePicture
// );

// router.delete('/profile-picture/:userId',
//     userMatchMiddleware,
//     ImageController.deleteProfilePicture
// );

// export default router;

// import { Router } from 'express';
// import { ImageController } from '../controllers/image.controller';
// import { uploadImage } from '../controllers/storage.controller';
// import { verifyToken } from '../services/auth';
// import { Request, Response, NextFunction } from 'express';
// import { UserData } from '../types/custom';
// import { User } from '../models/user';
// import multer from 'multer';
// // import { Storage } from 'firebase-admin/storage';

// const router = Router();
// const upload = multer();

// const transformUserToUserData = (user: User): UserData => {
//     return {
//         userId: user.userId,
//         email: user.email,
//         isGoogleAuth: user.isGoogleAuth || false,
//         name: user.name || '',
//         tier: user.tier || 'Just Looking',
//         weight: user.weight?.toString() || undefined,
//         height: user.height?.toString() || undefined,
//         gender: user.gender || undefined,
//         goals: user.goals || undefined,
//         dateOfBirth: user.dateOfBirth?.toString() || undefined,
//         imgUrl: user.imgUrl || undefined
//     };
// };

// const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await verifyToken(req);
//         if (!user) {
//             return res.status(401).json({ 
//                 success: false, 
//                 message: 'Authentication failed' 
//             });
//         }

//         // Transform the User model instance into UserData with proper type handling
//         req.user = transformUserToUserData(user);
//         next();
//     } catch (error) {
//         console.error('Auth middleware error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// const userMatchMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const paramUserId = req.params.userId;
//     const userIdFromToken = req.user?.userId;

//     console.log('Comparing user IDs:', { paramUserId, userIdFromToken });

//     if (!userIdFromToken || userIdFromToken.toString() !== paramUserId.toString()) {
//         return res.status(403).json({
//             success: false,
//             message: 'Not authorized to access this resource'
//         });
//     }

//     next();
// };

// const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
//     const { contentType } = req.body;
    
//     if (!contentType) {
//         return res.status(400).json({
//             success: false,
//             message: 'Content type is required'
//         });
//     }

//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (!allowedTypes.includes(contentType)) {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid content type. Allowed types: JPEG, PNG, GIF'
//         });
//     }

//     next();
// };

// // Apply middleware chain
// router.use(authMiddleware);

// // Routes with appropriate middleware chains
// router.post('/upload-url/:userId', 
//     userMatchMiddleware,
//     validateUploadRequest,
//     ImageController.getUploadUrl
// );

// router.put('/profile-picture/:userId',
//     userMatchMiddleware,
//     ImageController.updateProfilePicture
// );

// router.delete('/profile-picture/:userId',
//     userMatchMiddleware,
//     ImageController.deleteProfilePicture
// );

// router.post(
//     '/upload/:userId',
//     userMatchMiddleware,
//     upload.single('file'), // Multer middleware to handle single file upload
//     uploadImage
//   );

// export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { ImageController } from '../controllers/image.controller';
import { uploadImage } from '../controllers/storage.controller';
// import { getDownloadUrl } from 
import { verifyToken } from '../services/auth';
import { UserData } from '../@types/custom';
import { User } from '../models/user';
import multer from 'multer';

const router = Router();
const upload = multer();

const transformUserToUserData = (user: User): UserData => {
  return {
    userId: user.userId,
    email: user.email,
    isGoogleAuth: user.isGoogleAuth || false,
    name: user.name || '',
    tier: user.tier || 'Just Looking',
    weight: user.weight?.toString() || undefined,
    height: user.height?.toString() || undefined,
    gender: user.gender || undefined,
    goals: user.goals || undefined,
    dateOfBirth: user.dateOfBirth?.toString() || undefined,
    imgUrl: user.imgUrl || undefined,
  };
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await verifyToken(req);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication failed',
      });
      return;
    }

    // Transform the User model instance into UserData with proper type handling
    req.user = transformUserToUserData(user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const userMatchMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const paramUserId = req.params.userId;
  const userIdFromToken = req.user?.userId;

  console.log('Comparing user IDs:', { paramUserId, userIdFromToken });

  if (!userIdFromToken || userIdFromToken.toString() !== paramUserId.toString()) {
    res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
    return;
  }

  next();
};

const validateUploadRequest = (req: Request, res: Response, next: NextFunction) => {
  const { contentType } = req.body;

  if (!contentType) {
    res.status(400).json({
      success: false,
      message: 'Content type is required',
    });
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(contentType)) {
    res.status(400).json({
      success: false,
      message: 'Invalid content type. Allowed types: JPEG, PNG, GIF',
    });
    return;
  }

  next();
};

// Apply middleware chain
router.use(authMiddleware);

// Routes with appropriate middleware chains
router.post(
  '/upload-url/:userId',
  userMatchMiddleware,
  validateUploadRequest,
  ImageController.getUploadUrl
);

router.put(
  '/profile-picture/:userId',
  userMatchMiddleware,
  ImageController.updateProfilePicture
);

router.delete(
  '/profile-picture/:userId',
  userMatchMiddleware,
  ImageController.deleteProfilePicture
);

router.post(
  '/upload/:userId',
  userMatchMiddleware,
  upload.single('file'), // Multer middleware to handle single file upload
  uploadImage
);

router.post(
    '/download-url/:userId',
    userMatchMiddleware,
    ImageController.getDownloadUrl
  );


// router.post(
// '/staging-download-url/:userId',
// authMiddleware,
// userMatchMiddleware,
// ImageController.getStagingDownloadUrl
// );  

export default router;