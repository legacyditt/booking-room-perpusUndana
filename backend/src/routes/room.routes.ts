import { Router } from 'express';
import {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRooms,
    deleteRoom
} from '../controllers/room.controller';

const router = Router();

router.get('/room', getAllRooms);
router.get('/room/:id', getRoomById);
router.post('/room', createRoom);
router.put('/room/:id', updateRooms);
router.delete('/room/:id', deleteRoom);

export default router;