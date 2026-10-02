import Stock from '../models/Stock.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { escapeRegex, round2 } from '../utils/helpers.js';
import { generateHistory, VALID_PERIODS } from '../services/historyService.js';
import { seededRandom } from '../utils/random.js';

export const getStocks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q).trim()), 'i');
    filter.$or = [{ symbol: rx }, { companyName: rx }];
  }
  const stocks = await Stock.find(filter).sort({ symbol: 1 }).limit(Number(req.query.limit) || 100);
  res.json({ stocks });
});

export const getStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
  if (!stock) throw new AppError('Invalid stock symbol', 404);
  res.json({ stock });
});

export const getHistory = asyncHandler(async (req, res) => {
  const period = String(req.query.period || '1M').toUpperCase();
  if (!VALID_PERIODS.includes(period)) throw new AppError(`Period must be one of ${VALID_PERIODS.join(', ')}`, 400);
  const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
  if (!stock) throw new AppError('Invalid stock symbol', 404);
  res.json({ symbol: stock.symbol, period, history: generateHistory(stock.symbol, stock.currentPrice, period) });
});

// Mock index values: base level + a small random move that changes every hour
const INDICES = [
  { name: 'NIFTY 50', base: 24500 },
  { name: 'SENSEX', base: 80500 },
  { name: 'NIFTY BANK', base: 52000 },
  { name: 'NIFTY IT', base: 38500 },
];
export const getIndices = asyncHandler(async (req, res) => {
  const hour = new Date().toISOString().slice(0, 13);
  const indices = INDICES.map(({ name, base }) => {
    const rnd = seededRandom(`${name}-${hour}`);
    const changePercent = round2((rnd() - 0.45) * 2.4);
    const value = round2(base * (1 + (rnd() - 0.5) * 0.01));
    return { name, value, changePercent, change: round2((value * changePercent) / 100) };
  });
  res.json({ indices, note: 'Simulated values, not real market data.' });
});
