import { Router } from "express";
import {
    getAllSessions,
    getSessionById,
    createSession,
    updateSession,
    deleteSession
} from '../controllers/sessions.controller';

const router = Router();

router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;