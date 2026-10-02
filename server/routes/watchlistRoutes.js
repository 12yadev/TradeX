import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';

const router = Router();
router.get('/', getWatchlist);
router.post('/', [body('symbol').trim().notEmpty().withMessage('Stock symbol is required')], validate, addToWatchlist);
router.delete('/:symbol', removeFromWatchlist);
export default router;
