import { Router } from 'express';
//import { getAllProducts, getProduct, deleteProduct, updateProduct } from '../controllers/productController'
import { getAllProducts, getProduct, deleteProduct } from '../controllers/productController'
const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
//router.put('/:productId', updateProduct);
router.delete('/:id', deleteProduct);

export default router;