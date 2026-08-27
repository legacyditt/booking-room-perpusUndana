import { Router } from "express";
import {
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/settings.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getSystemSettings);
router.put("/", requireAdmin, updateSystemSettings);

export default router;
