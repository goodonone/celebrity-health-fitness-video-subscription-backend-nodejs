import { Router } from 'express';
import { createPayment, updatePayment } from '../controllers/paymentController'

const router = Router();

// router.get('/', getAllPayments);
router.post('/', createPayment);
//  router.get('/:paymentId', getPayment);
router.put('/:userId', updatePayment);

export default router;