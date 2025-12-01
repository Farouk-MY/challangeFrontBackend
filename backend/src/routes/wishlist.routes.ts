import { Router } from 'express';
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
    clearWishlist,
} from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:id', removeFromWishlist);
router.get('/check/:productId', checkWishlist);
router.delete('/clear', clearWishlist);

export default router;