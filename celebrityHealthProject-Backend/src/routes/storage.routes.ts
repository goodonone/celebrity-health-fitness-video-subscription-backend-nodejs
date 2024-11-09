import { Router } from 'express';
import { getImage, moveImage, getStorageFile } from '../controllers/storage.controller';
import { authMiddleware, firebaseAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/storage/move/:userId', authMiddleware, moveImage);

// Route for serving proxied images
router.get('/storage/profileImages/:userId/:fileName', getImage);

// Route for serving staged images - requires authentication
router.get('/storage/staging/profileImages/:userId/:fileName', authMiddleware, firebaseAuthMiddleware, getImage);

// router.get('/storage/image', authMiddleware, proxyImage);

router.get('/storage/staging/*', authMiddleware, getImage);

router.get('/storage/*', getStorageFile);

router.get('/*', getStorageFile);

export default router;