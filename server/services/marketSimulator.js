import Stock from '../models/Stock.js';
import { matchPendingOrders } from './tradeService.js';
import { round2 } from '../utils/helpers.js';

const INTERVAL_MS = 20000;

// Nudges every stock price by a small random amount so the app feels alive.
// These are SIMULATED prices, not real market data.
export function startMarketSimulator() {
  if (process.env.MARKET_SIMULATOR === 'off') return;
  setInterval(async () => {
    try {
      const stocks = await Stock.find();
      await Stock.bulkWrite(
        stocks.map((s) => {
          const price = round2(Math.max(1, s.currentPrice * (1 + (Math.random() - 0.5) * 0.006)));
          return {
            updateOne: {
              filter: { _id: s._id },
              update: {
                $set: {
                  currentPrice: price,
                  high: Math.max(s.high ?? price, price),
                  low: Math.min(s.low ?? price, price),
                  volume: (s.volume || 0) + Math.floor(Math.random() * 5000),
                },
              },
            },
          };
        })
      );
      await matchPendingOrders();
    } catch (err) {
      console.error('Market simulator error:', err.message);
    }
  }, INTERVAL_MS);
  console.log('Market simulator running (simulated prices, not real-time data)');
}
