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
router.get('/room/:roomId', getBookingPriceByRoom);
router.post('/', createBookingPrice);
router.put('/room/:roomId', updateBookingPrice);
router.delete('/room/:roomId', deleteBookingPrice);

export default router;
