import { Router, Request, Response, NextFunction } from 'express';
import { ImageController } from '../controllers/image.controller';
import { uploadImage } from '../controllers/storage.controller';
// import { getDownloadUrl } from 
import { verifyToken } from '../services/auth';
import { UserData } from '../@types/custom';
import { User } from '../models/user';
import multer from 'multer';
import { moveImage } from '../controllers/storage.controller';

const router = Router();
// const upload = multer();
// const upload = multer({ storage: multer.memoryStorage() });
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type'));
      return;
    }
    cb(null, true);
  }
});


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

const handleMulterError = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next(error);
};

// Apply middleware chain
// router.use(authMiddleware);

// Routes with appropriate middleware chains
// router.post(
//   '/upload-url/:userId',
//   userMatchMiddleware,
//   validateUploadRequest,
//   ImageController.getUploadUrl
// );

// // router.post('/upload/:userId', 
// //   authMiddleware, 
// //   upload.single('file'), 
// //   uploadImage);

// router.put(
//   '/profile-picture/:userId',
//   userMatchMiddleware,
//   ImageController.updateProfilePicture
// );

// router.delete(
//   '/profile-picture/:userId',
//   userMatchMiddleware,
//   ImageController.deleteProfilePicture
// );

// router.post(
//   '/upload/:userId',
//   userMatchMiddleware,
//   upload.single('file'), // Multer middleware to handle single file upload
//   uploadImage
// );

// router.post(
//     '/download-url/:userId',
//     userMatchMiddleware,
//     ImageController.getDownloadUrl
//   );
 
// router.post(
//   '/move/:userId', 
//   authMiddleware, 
//   moveImage);  

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

// File Upload Routes
router.post(
  '/upload/:userId',           // Will be /api/images/upload/:userId
  authMiddleware,
  userMatchMiddleware,
  upload.single('file'),
  handleMulterError,
  uploadImage
);

router.post(
  '/upload-url/:userId',
  authMiddleware,
  userMatchMiddleware,
  validateUploadRequest,
  ImageController.getUploadUrl
);

router.post(
  '/move/:userId',            // Will be /api/images/move/:userId
  authMiddleware,
  userMatchMiddleware,
  moveImage
);

// Image Management Routes
router.put(
  '/profile/:userId',         // Will be /api/images/profile/:userId
  authMiddleware,
  userMatchMiddleware,
  ImageController.updateProfilePicture
);

router.delete(
  '/profile/:userId',         // Will be /api/images/profile/:userId
  authMiddleware,
  userMatchMiddleware,
  ImageController.deleteProfilePicture
);

router.post(
  '/download/:userId',        // Will be /api/images/download/:userId
  authMiddleware,
  userMatchMiddleware,
  ImageController.getDownloadUrl
);


export default router;