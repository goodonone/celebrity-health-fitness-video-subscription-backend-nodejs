import { Router } from 'express';
import { createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController';

const router = Router();


router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id',getUser);
router.put('/:id',updateUser);
router.delete('/:id', deleteUser);

export default router;