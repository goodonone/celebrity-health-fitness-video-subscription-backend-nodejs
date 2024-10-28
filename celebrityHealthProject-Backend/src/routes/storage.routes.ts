import { Router } from 'express';
import { getImage } from '../controllers/storage.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Route for serving proxied images
router.get('/storage/profileImages/:userId/:fileName', getImage);

export default router;