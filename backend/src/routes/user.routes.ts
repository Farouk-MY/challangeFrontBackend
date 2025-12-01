import { Router } from 'express';
import {
    updateProfile,
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    setDefaultAddress,
    deleteAddress,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes
router.put('/profile', updateProfile);

// Address routes
router.get('/addresses', getAddresses);
router.get('/addresses/:id', getAddressById);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.patch('/addresses/:id/default', setDefaultAddress);
router.delete('/addresses/:id', deleteAddress);

export default router;