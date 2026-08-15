import { Router } from 'express';
import { createAdmins, getAllUsers, updateUserRole } from '../controllers/user.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAdmin, getAllUsers);
router.post('/admin', requireAdmin, createAdmins);
router.patch('/:id/role', requireAdmin, updateUserRole);

export default router;
