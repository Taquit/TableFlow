import { Router } from "express";
import { getAllGuests, getGuestById, deleteGuestById, createGuest, updateGuest, getGuestsByEventId, getGuestsByTableIdAndEventId } from "../controllers/guestController.js";


const router = Router();

router.get('/', getAllGuests);
router.get('/table/:tableId/event/:eventId', getGuestsByTableIdAndEventId);
router.get('/event/:eventId', getGuestsByEventId);
router.get('/:id', getGuestById);
router.delete('/:id', deleteGuestById);
router.post('/', createGuest);
router.put('/:id', updateGuest);

export default router;