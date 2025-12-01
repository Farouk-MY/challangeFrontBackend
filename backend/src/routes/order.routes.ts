import { Router } from 'express';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// User routes (authenticated)
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/cancel', authenticate, cancelOrder);

// Admin routes
router.get('/admin/all', authenticate, authorize('ADMIN'), getAllOrders);
router.get('/admin/stats', authenticate, authorize('ADMIN'), getOrderStats);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);

export default router;