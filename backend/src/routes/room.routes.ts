import { Router } from 'express';
import {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRooms,
    deleteRoom
} from '../controllers/room.controller';

const router = Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', createRoom);
router.put('/:id', updateRooms);
router.delete('/:id', deleteRoom);

export default router;