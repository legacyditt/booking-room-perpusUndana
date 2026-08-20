import { Router } from "express";
import {
  exportAdminActivities,
  getAdminActivities,
} from "../controllers/adminActivity.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/export", requireAdmin, exportAdminActivities);
router.get("/", requireAdmin, getAdminActivities);

export default router;
