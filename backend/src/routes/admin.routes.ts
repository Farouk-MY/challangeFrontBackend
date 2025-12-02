import { Router } from 'express';
import {
    getDashboardStats,
    getSalesAnalytics,
    getTopProducts,
    getRecentOrders,
    getLowStockProducts,
    getRevenueByCategory,
    getCustomerStats,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
} from '../controllers/admin-users.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize('ADMIN'));

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/sales-analytics', getSalesAnalytics);
router.get('/dashboard/top-products', getTopProducts);
router.get('/dashboard/recent-orders', getRecentOrders);
router.get('/dashboard/low-stock', getLowStockProducts);
router.get('/dashboard/revenue-by-category', getRevenueByCategory);
router.get('/dashboard/customer-stats', getCustomerStats);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;