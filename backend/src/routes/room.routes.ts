import { Router } from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRooms,
  deleteRoom,
  getRoomAvailability,
  getRoomDailyAvailability,
  getRoomMonthAvailability,
} from "../controllers/room.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getAllRooms);
router.get("/:id/availability", requireAuth, getRoomAvailability);
router.get("/:id/daily-availability", requireAuth, getRoomDailyAvailability);
router.get("/:id/month-availability", requireAuth, getRoomMonthAvailability);
router.get("/:id", requireAuth, getRoomById);
router.post("/", requireAdmin, createRoom);
router.put("/:id", requireAdmin, updateRooms);
router.delete("/:id", requireAdmin, deleteRoom);

export default router;
