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

import { Router } from 'express';
import { ImageController } from '../controllers/image.controller';
import { verifyToken } from '../services/auth';
import { Response, NextFunction } from 'express';
import { RequestWithUser } from '../types/custom';

const router = Router();

// Middleware to verify token and attach user to request
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const user = await verifyToken(req);
        if (!user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Apply auth middleware to all routes
router.use(authMiddleware);

// Add user verification middleware
const userVerificationMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || req.user.userId !== req.params.userId) {
        return res.status(403).json({ message: 'Not authorized to modify this user' });
    }
    next();
};

router.use('/:userId', userVerificationMiddleware);

// Routes
router.post('/upload-url/:userId', ImageController.getUploadUrl);
router.put('/profile-picture/:userId', ImageController.updateProfilePicture);
router.delete('/profile-picture/:userId', ImageController.deleteProfilePicture);

export default router;