import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import authRoutes from './authRoutes.js';
import stockRoutes from './stockRoutes.js';
import watchlistRoutes from './watchlistRoutes.js';
import orderRoutes from './orderRoutes.js';
import { holdingsRouter, positionsRouter } from './holdingRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import { fundsRouter, transactionsRouter } from './fundsRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

router.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    message: 'TradeX API is running',
    disclaimer: 'TradeX is an educational paper-trading project and does not execute real stock-market transactions.',
  })
);

router.use('/auth', authRoutes);
router.use('/stocks', stockRoutes);
// Everything below requires a valid JWT
router.use('/watchlist', protect, watchlistRoutes);
router.use('/orders', protect, orderRoutes);
router.use('/holdings', protect, holdingsRouter);
router.use('/positions', protect, positionsRouter);
router.use('/portfolio', protect, portfolioRoutes);
router.use('/funds', protect, fundsRouter);
router.use('/transactions', protect, transactionsRouter);
router.use('/user', protect, userRoutes);

export default router;
