import { Router } from 'express';
import { getAllProducts, getProduct, deleteProduct, updateProduct } from '../controllers/productController'

const router = Router();

router.get('/', getAllProducts);
router.get('/:productId', getProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;