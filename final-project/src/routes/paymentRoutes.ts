import { Router } from 'express';
import { getAllPayments, getPayment, updatePayment } from '../controllers/paymentContoller'

const router = Router();

router.get('/', getAllPayments);
// router.post('/', createPayment);
 router.get('/:paymentId', getPayment);
router.put('/:paymentId', updatePayment);

export default router;