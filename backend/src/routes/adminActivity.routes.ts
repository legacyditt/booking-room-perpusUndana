import { Router } from "express";
import { getAdminActivities } from "../controllers/adminActivity.controller";
import { requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", requireAdmin, getAdminActivities);

export default router;
