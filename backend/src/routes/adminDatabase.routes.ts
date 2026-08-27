import { Router } from "express";
import {
  getDatabaseStats,
  downloadDatabaseBackup,
  clearDatabaseBookings,
} from "../controllers/adminDatabase.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/stats", requireAdmin, getDatabaseStats);
router.get("/backup", requireAdmin, downloadDatabaseBackup);
router.post("/clear", requireAdmin, clearDatabaseBookings);

export default router;
