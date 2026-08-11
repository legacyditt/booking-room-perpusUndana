import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/user.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAdmin, getAllUsers);
router.patch('/:id/role', requireAdmin, updateUserRole);

export default router;
