import { Router } from 'express';
import { createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, updateUser2 } from '../controllers/userController';

const router = Router();


router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id',getUser);
router.put('/:id',updateUser);
router.put('/data/:id',updateUser2);
router.delete('/:id', deleteUser);

export default router;