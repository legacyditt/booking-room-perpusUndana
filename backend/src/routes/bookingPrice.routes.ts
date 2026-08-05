import { Router } from 'express';
import {
    getAllBookingPrices,
    getBookingPriceByRoom,
    createBookingPrice,
    updateBookingPrice,
    deleteBookingPrice
} from '../controllers/bookingPrice.controller';

const router = Router();

router.get('/', getAllBookingPrices);
router.get('/:roomId', getBookingPriceByRoom);
router.post('/', createBookingPrice);
router.put('/:roomId', updateBookingPrice);
router.delete('/:roomId', deleteBookingPrice);

export default router;
