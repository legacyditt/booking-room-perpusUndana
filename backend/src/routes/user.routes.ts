import { Router } from 'express';
import { getAllUsers, updateUserRole } from '../controllers/user.controller';

const router = Router();

router.get('/', getAllUsers);
router.patch('/:id/role', updateUserRole);

export default router;
