import { Router } from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update/:id', updateCartItem);
router.delete('/remove/:id', removeFromCart);
router.delete('/clear', clearCart);

export default router;