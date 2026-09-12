import { Router } from 'express';
import {
  createRfq,
  updateRfq,
  getAllRfqs,
  getMyRfqs,
  getRfqById,
  closeRfq,
} from '../controllers/rfqController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public / optional auth for browsing
router.get('/', getAllRfqs);
router.get('/detail/:id', authenticateToken, getRfqById);

// Buyer protected routes
router.post('/', authenticateToken, authorizeRoles('BUYER'), createRfq);
router.get('/my', authenticateToken, authorizeRoles('BUYER'), getMyRfqs);
router.put('/:id', authenticateToken, authorizeRoles('BUYER'), updateRfq);
router.patch('/:id/close', authenticateToken, authorizeRoles('BUYER'), closeRfq);

export default router;
