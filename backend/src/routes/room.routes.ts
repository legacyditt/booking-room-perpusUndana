import { Router } from 'express';
import {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRooms,
    deleteRoom,
    getRoomAvailability
} from '../controllers/room.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getAllRooms);
router.get('/:id/availability', requireAuth, getRoomAvailability);
router.get('/:id', requireAuth, getRoomById);
router.post('/', requireAdmin, createRoom);
router.put('/:id', requireAdmin, updateRooms);
router.delete('/:id', requireAdmin, deleteRoom);

export default router;
