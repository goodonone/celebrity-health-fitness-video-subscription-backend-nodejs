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
import { createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, checkEmail, checkPassword, updatePassword } from '../controllers/userController';


const router = Router();

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

