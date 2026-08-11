import { Router } from 'express';
import {
    getAllBookingPrices,
    getBookingPriceByRoom,
    createBookingPrice,
    updateBookingPrice,
    deleteBookingPrice
} from '../controllers/bookingPrice.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getAllBookingPrices);
router.get('/:roomId', requireAuth, getBookingPriceByRoom);
router.post('/', requireAdmin, createBookingPrice);
router.put('/:roomId', requireAdmin, updateBookingPrice);
router.delete('/:roomId', requireAdmin, deleteBookingPrice);

export default router;
