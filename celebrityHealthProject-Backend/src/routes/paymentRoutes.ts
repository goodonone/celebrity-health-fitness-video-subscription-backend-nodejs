import { Router } from 'express';
import { createPayment, createStorePayment, updatePayment, updatePaymentForSubscription } from '../controllers/paymentController'

const router = Router();

// router.get('/', getAllPayments);
router.post('/', createPayment);
router.post('/store/', createStorePayment);
//  router.get('/:paymentId', getPayment);
router.put('/:userId', updatePayment);
router.put('/:userId', updatePaymentForSubscription);

export default router;