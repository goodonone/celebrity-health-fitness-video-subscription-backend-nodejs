import { Router } from 'express';
import { createPayment, updatePayment, updatePaymentforSubsciption } from '../controllers/paymentController'

const router = Router();

// router.get('/', getAllPayments);
router.post('/', createPayment);
//  router.get('/:paymentId', getPayment);
router.put('/:userId', updatePayment);
router.put('/:userId', updatePaymentforSubsciption);

export default router;