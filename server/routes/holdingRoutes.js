import { Router } from 'express';
import { getHoldings, getPositions } from '../controllers/holdingController.js';

export const holdingsRouter = Router().get('/', getHoldings);
export const positionsRouter = Router().get('/', getPositions);
