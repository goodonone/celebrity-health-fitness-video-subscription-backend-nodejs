import { Router } from 'express';
import { getAllPayment, getPayment, updatePayment, deletePayment } from '../controllers/paymentContoller'

const router = Router();

router.get('/', getAllPayment);
// router.post('/', createPayment);
 router.get('/:paymentId', getPayment);
router.put('/:paymentId', updatePayment);
router.delete('/:paymentId', deletePayment);

export default router;