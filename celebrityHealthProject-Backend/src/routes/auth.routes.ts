import { Router } from 'express';
import { getFirebaseToken } from '../controllers/auth.controller';
import { authMiddleware, firebaseAuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Use both middlewares for Firebase token endpoint
router.post('/auth/firebase-token', authMiddleware, firebaseAuthMiddleware, getFirebaseToken);

export default router;