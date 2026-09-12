import { Router } from 'express';
import {
  createOrUpdateQuotation,
  getMyQuotations,
  updateQuotationStatus,
  withdrawQuotation,
} from '../controllers/quotationController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, authorizeRoles('SUPPLIER'), createOrUpdateQuotation);
router.get('/my', authenticateToken, authorizeRoles('SUPPLIER'), getMyQuotations);
router.patch('/:id/status', authenticateToken, authorizeRoles('BUYER'), updateQuotationStatus);
router.delete('/:id', authenticateToken, authorizeRoles('SUPPLIER'), withdrawQuotation);

export default router;
