import { Router } from 'express';
import { getImage, moveImage } from '../controllers/storage.controller';
import { authMiddleware, firebaseAuthMiddleware } from '../middlewares/auth.middleware';


const router = Router();

// Route for serving proxied images
router.get('/storage/profileImages/:userId/:fileName', getImage);

// Route for serving staged images - requires authentication
router.get('/storage/staging/profileImages/:userId/:fileName', authMiddleware, firebaseAuthMiddleware, getImage);

// storage.routes.ts
router.post('/storage/move/:userId', authMiddleware, moveImage);

export default router;