// import { Router } from 'express';
// import { createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, checkEmail, checkPassword, updatePassword } from '../controllers/userController';
// import express from 'express';
// import jwt from 'jsonwebtoken';


// const router = Router();
// const app = express();

// router.post('/', createUser);
// router.post('/login', loginUser);
// router.get('/', getAllUsers);
// router.get('/:id',getUser);
// // router.put('/:id',updateUser);
// router.put('/data/:id',updateUser);
// router.delete('/:id', deleteUser);
// router.post('/check-email', checkEmail);
// router.post('/check-password/:id', checkPassword);
// router.put('/update-password/:id', updatePassword);


// app.get('/me', authenticateJWT, (req, res) => {
//     const user = req.user; // Assuming user is attached to req after JWT validation
//     if (user) {
//       res.json({ userId: user.id });  // Return the user ID
//     } else {
//       res.status(403).send('Forbidden');  // If no user is found, return 403 Forbidden
//     }
//   });

// export default router;

import { Router } from 'express';
import { createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, checkEmail, checkPassword, updatePassword, requestPasswordReset, resetPassword } from '../controllers/userController';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Get and validate JWT secret at startup
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

// Define your user routes
router.post('/', createUser);
router.post('/login', loginUser);
// router.post('/google-auth', googleAuth); 
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/data/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/check-email', checkEmail);
router.post('/check-password/:id', checkPassword);
router.put('/update-password/:id', updatePassword);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ 
                error: 'User ID required',
                message: 'No user ID provided in request body'
            });
        }

        // Get current time in seconds
        const now = Math.floor(Date.now() / 1000);

        // Generate new token with explicit timestamps
        const newToken = jwt.sign(
            { 
                userId: userId,
                iat: now,
                exp: now + (24 * 60 * 60) // 24 hours in seconds
            },
            secret,
            { 
                algorithm: 'HS256'
            }
        );

        // Log token generation (remove in production)
        console.log('New token generated:', {
            userId,
            iat: new Date(now * 1000).toISOString(),
            exp: new Date((now + 24 * 60 * 60) * 1000).toISOString()
        });

        res.json({ 
            token: newToken,
            expiresIn: 24 * 60 * 60,
            issuedAt: now
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ 
            error: 'Token refresh failed',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// router.get('/check-user-exists/:email', checkUserExists);

export default router;

// Protected route to get current user info
// router.get('/me', authenticateJWT, (req, res) => {
//     const user = (req as any).user;  // Use `as any` to access user
  
//     if (user) {
//       res.json({ userId: user.userId });
//     } else {
//       res.status(403).json({ message: 'Forbidden' });
//     }
//   });

