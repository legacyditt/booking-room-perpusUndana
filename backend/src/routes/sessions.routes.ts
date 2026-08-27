import { Router } from "express";
import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession
} from '../controllers/sessions.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getAllSessions);
router.get('/:id', requireAuth, getSessionById);
router.post('/', requireAdmin, createSession);
router.put('/:id', requireAdmin, updateSession);
router.delete('/:id', requireAdmin, deleteSession);

export default router;