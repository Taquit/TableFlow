import { Router } from "express";
import { getAllEvents, getEventById, deletEventById, createEvent, updateEvent, getEventAccounting } from "../controllers/eventController.js";
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getAllEvents);
router.get('/:id/accounting', getEventAccounting);
router.get('/:id', getEventById);
router.delete('/:id', verifyToken, isAdmin, deletEventById);
router.post('/', verifyToken, isAdmin, createEvent);
router.put('/:id', verifyToken, isAdmin, updateEvent);

export default router;