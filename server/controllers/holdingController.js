import { asyncHandler } from '../utils/AppError.js';
import { getEnrichedHoldings, summarize } from '../services/portfolioService.js';

// Long-term holdings only
export const getHoldings = asyncHandler(async (req, res) => {
  const holdings = await getEnrichedHoldings(req.user._id, { product: 'LONGTERM' });
  res.json({ holdings, summary: summarize(holdings) });
});

// Open positions: intraday and long-term
export const getPositions = asyncHandler(async (req, res) => {
  const positions = await getEnrichedHoldings(req.user._id);
  res.json({ positions, summary: summarize(positions) });
});
