import { Router } from "express";
import { getAllEvents, getEventById, deletEventById, createEvent, updateEvent } from "../controllers/eventController.js";


const router = Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.delete('/:id', deletEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent);

export default router;