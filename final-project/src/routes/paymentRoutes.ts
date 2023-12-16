import { Router } from 'express';
import { getAllPayments, getPayment, createPayment, updatePayment } from '../controllers/paymentController'

const router = Router();

router.get('/', getAllPayments);
router.post('/', createPayment);
 router.get('/:paymentId', getPayment);
router.put('/:paymentId', updatePayment);

export default router;