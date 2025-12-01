import { Router } from 'express';
import {
    submitContact,
    getContactById,
    getAllContacts,
    replyToContact,
    updateContactStatus,
    deleteContact,
    getContactStats,
} from '../controllers/contact.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/', submitContact);

// Admin routes
router.get('/admin/all', authenticate, authorize('ADMIN'), getAllContacts);
router.get('/admin/stats', authenticate, authorize('ADMIN'), getContactStats);
router.get('/:id', authenticate, authorize('ADMIN'), getContactById);
router.post('/:id/reply', authenticate, authorize('ADMIN'), replyToContact);
router.patch('/:id/status', authenticate, authorize('ADMIN'), updateContactStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteContact);

export default router;