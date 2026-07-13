import { Router } from "express";
import { getAllEvents, getEventById, deletEventById, createEvent, updateEvent, getEventAccounting } from "../controllers/eventController.js";


const router = Router();

router.get('/', getAllEvents);
router.get('/:id/accounting', getEventAccounting);
router.get('/:id', getEventById);
router.delete('/:id', deletEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent);

export default router;