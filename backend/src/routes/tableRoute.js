import { Router } from "express";
import { getAllTables, getTableById, deleteTableById, createTable, updateTable, getTablesByEventId } from "../controllers/tableController.js";


const router = Router();

router.get('/', getAllTables);
router.get('/event/:eventId', getTablesByEventId);
router.get('/:id', getTableById);
router.delete('/:id', deleteTableById);
router.post('/', createTable);
router.put('/:id', updateTable);

export default router; 