import { Router } from 'express';
import { getCart, addToCart, removeFromCart, clearCart } from '../controllers/cartController';

const router = Router();

router.get('/:userId', getCart);
router.post('/:userId/:productId', addToCart);
router.delete('/:userId/:productId', removeFromCart);
router.delete('/:userId', clearCart);

// router.put('/update-quantity/:userId/:productId', updateQuantity);

export default router;