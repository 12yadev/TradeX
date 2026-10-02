import { asyncHandler } from '../utils/AppError.js';
import { getEnrichedHoldings, summarize } from '../services/portfolioService.js';
import { seededRandom } from '../utils/random.js';
import { round2 } from '../utils/helpers.js';

// Mock 30-day value curve from invested amount to current value (illustrative only)
function buildPerformance(userId, invested, current) {
  if (!invested) return [];
  const rnd = seededRandom(String(userId));
  const days = 30;
  return Array.from({ length: days }, (_, i) => {
    const t = i / (days - 1);
    const noise = (rnd() - 0.5) * 0.04 * invested * 4 * t * (1 - t);
    const d = new Date(Date.now() - (days - 1 - i) * 86400000);
    return {
      label: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      value: round2(invested + (current - invested) * t + noise),
    };
  });
}

export const getPortfolio = asyncHandler(async (req, res) => {
  const rows = await getEnrichedHoldings(req.user._id);
  const summary = summarize(rows);

  const bySector = {};
  rows.forEach((r) => { bySector[r.sector] = (bySector[r.sector] || 0) + r.currentValue; });
  const allocation = Object.entries(bySector).map(([name, value]) => ({ name, value: round2(value) }));

  const ranked = [...rows].sort((a, b) => b.pnlPercent - a.pnlPercent);
  res.json({
    ...summary,
    holdingsCount: rows.length,
    allocation,
    topPerformers: ranked.filter((r) => r.pnl > 0).slice(0, 3),
    worstPerformers: [...ranked].reverse().filter((r) => r.pnl < 0).slice(0, 3),
    pnlBySymbol: rows.map((r) => ({ symbol: r.symbol, pnl: r.pnl })),
    performance: buildPerformance(req.user._id, summary.totalInvestment, summary.currentValue),
  });
});
