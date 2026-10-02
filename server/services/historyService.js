import { seededRandom } from '../utils/random.js';
import { round2 } from '../utils/helpers.js';

// period -> { points, volatility per step, label style }
const PERIODS = {
  '1D': { points: 75, vol: 0.0018, unit: 'time' },
  '1W': { points: 35, vol: 0.0045, unit: 'time' },
  '1M': { points: 30, vol: 0.011, unit: 'day', days: 30 },
  '6M': { points: 126, vol: 0.012, unit: 'day', days: 182 },
  '1Y': { points: 252, vol: 0.012, unit: 'day', days: 365 },
  '5Y': { points: 260, vol: 0.026, unit: 'day', days: 1825 },
};

export const VALID_PERIODS = Object.keys(PERIODS);

function labelFor(period, i, cfg) {
  const now = new Date();
  if (period === '1D') {
    const mins = 9 * 60 + 15 + i * 5; // market opens 9:15, 5-minute candles
    return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  }
  if (period === '1W') {
    const d = new Date(now.getTime() - (cfg.points - 1 - i) * (7 * 24 * 3600 * 1000) / cfg.points);
    return d.toLocaleDateString('en-IN', { weekday: 'short', hour: '2-digit' });
  }
  const d = new Date(now.getTime() - (cfg.points - 1 - i) * (cfg.days * 24 * 3600 * 1000) / cfg.points);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: period === '5Y' || period === '1Y' ? '2-digit' : undefined });
}

// Builds a random-walk series (stable per stock + period) that ends at the current price.
export function generateHistory(symbol, currentPrice, period = '1M') {
  const cfg = PERIODS[period];
  const rnd = seededRandom(`${symbol}-${period}`);
  const raw = [1];
  for (let i = 1; i < cfg.points; i++) {
    raw.push(raw[i - 1] * (1 + (rnd() - 0.48) * 2 * cfg.vol));
  }
  const scale = currentPrice / raw[raw.length - 1];
  return raw.map((v, i) => ({ label: labelFor(period, i, cfg), price: round2(v * scale) }));
}
