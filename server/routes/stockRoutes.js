import { Router } from 'express';
import { getStocks, getStock, getHistory, getIndices } from '../controllers/stockController.js';

const router = Router();
router.get('/', getStocks);
router.get('/indices/summary', getIndices); // must come before /:symbol
router.get('/:symbol/history', getHistory);
router.get('/:symbol', getStock);
export default router;
