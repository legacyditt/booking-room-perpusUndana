import { Router } from "express";
import {
    getMyBookings,
    getAllBookings,
    getBookingById,
    createBooking,
    deleteBooking,
    updateBookingStatus
} from '../controllers/bookings.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/me', requireAuth, getMyBookings)
router.get('/', requireAdmin, getAllBookings)
router.get('/:id', requireAdmin, getBookingById)
router.post('/', requireAuth, createBooking)
router.delete('/:id', requireAdmin, deleteBooking)
router.patch('/:id/status', requireAdmin, updateBookingStatus)

export default router;