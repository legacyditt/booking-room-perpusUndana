import { Router } from "express";
import {
  getMyBookings,
  getAllBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  deleteBooking,
  updateBookingStatus,
  updateBooking,
} from "../controllers/bookings.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getMyBookings);
router.get("/", requireAdmin, getAllBookings);
router.get("/:id", requireAdmin, getBookingById);
router.post("/", requireAuth, createBooking);
router.patch("/:id/cancel", requireAuth, cancelBooking);
router.delete("/:id", requireAdmin, deleteBooking);
router.patch("/:id/status", requireAdmin, updateBookingStatus);
router.patch("/:id", requireAuth, updateBooking);

export default router;
