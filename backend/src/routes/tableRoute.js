import { Router } from "express";
import { getAllTables, getTableById, deleteTableById, createTable, updateTable, getTablesByEventId } from "../controllers/tableController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";


const router = Router();

router.get('/', getAllTables);
router.get('/event/:eventId', getTablesByEventId);
router.get('/:id', getTableById);
router.delete('/:id', verifyToken, isAdmin, deleteTableById);
router.post('/', verifyToken, isAdmin, createTable);
router.put('/:id', verifyToken, isAdmin, updateTable);

export default router;