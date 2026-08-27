import { Router } from "express";
import {
  exportAdminActivities,
  getAdminActivities,
} from "../controllers/adminActivity.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/export", requireAdmin, exportAdminActivities);
router.get("/", requireAdmin, getAdminActivities);

export default router;
