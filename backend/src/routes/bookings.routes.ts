import { Router } from "express";
import {
    getUserBookings,
    getAllBookings,
    getBookingById,
    createBooking,
    deleteBooking,
    updateBookingStatus
} from '../controllers/bookings.controller';

const router = Router();

router.get('/user/:userId', getUserBookings)
router.get('/', getAllBookings)
router.get('/:id', getBookingById)
router.post('/', createBooking)
router.delete('/:id', deleteBooking)
router.patch('/:id/status', updateBookingStatus)

export default router;