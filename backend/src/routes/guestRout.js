import { Router } from "express";
import { getAllGuests, getGuestById, deleteGuestById, createGuest, updateGuest, getGuestsByEventId } from "../controllers/guestController.js";


const router = Router();

router.get('/', getAllGuests);
router.get('/:id', getGuestById);
router.delete('/:id', deleteGuestById);
router.post('/', createGuest);
router.put('/:id', updateGuest);
router.get('/event/:eventId', getGuestsByEventId);

export default router;