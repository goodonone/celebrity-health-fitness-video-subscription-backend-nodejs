import { Router } from 'express';
import { createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, checkEmail, checkPassword, updatePassword } from '../controllers/userController';

const router = Router();


router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id',getUser);
// router.put('/:id',updateUser);
router.put('/data/:id',updateUser);
router.delete('/:id', deleteUser);
router.post('/check-email', checkEmail);
router.post('/check-password/:id', checkPassword);
router.put('/update-password/:id', updatePassword);

export default router;