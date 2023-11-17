import { Router } from 'express';
import { createUser, loginUser, getUser, getAllUsers } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/:id',getUser);

export default router;