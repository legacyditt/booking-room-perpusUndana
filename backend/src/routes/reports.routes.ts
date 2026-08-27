import { Router } from "express";
import { getReportSummary, exportReport } from "../controllers/reports.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/summary", requireAdmin, getReportSummary);
router.get("/export", requireAdmin, exportReport);

export default router;
