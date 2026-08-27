import { Router } from "express";
import {
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/settings.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getSystemSettings);
router.put("/", requireAdmin, updateSystemSettings);

export default router;
