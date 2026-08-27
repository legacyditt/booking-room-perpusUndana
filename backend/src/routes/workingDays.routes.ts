import { Router } from "express";
import {
  getWorkingDays,
  updateWorkingDays,
} from "../controllers/settings.controller";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, getWorkingDays);
router.put("/", requireAdmin, updateWorkingDays);

export default router;
