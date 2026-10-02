import Holding from '../models/Holding.js';
import Stock from '../models/Stock.js';
import { round2 } from '../utils/helpers.js';

// Returns holdings with live price, invested value, current value and P&L
export async function getEnrichedHoldings(userId, filter = {}) {
  const holdings = await Holding.find({ userId, ...filter }).sort({ symbol: 1 });
  const stocks = await Stock.find({ symbol: { $in: holdings.map((h) => h.symbol) } });
  const stockMap = new Map(stocks.map((s) => [s.symbol, s]));

  return holdings.map((h) => {
    const stock = stockMap.get(h.symbol);
    const currentPrice = stock?.currentPrice ?? h.currentPrice ?? h.averagePrice;
    const invested = round2(h.quantity * h.averagePrice);
    const currentValue = round2(h.quantity * currentPrice);
    const pnl = round2(currentValue - invested);
    return {
      _id: h._id,
      symbol: h.symbol,
      companyName: h.companyName || stock?.companyName,
      sector: stock?.sector || 'Other',
      product: h.product,
      quantity: h.quantity,
      averagePrice: h.averagePrice,
      currentPrice,
      invested,
      currentValue,
      pnl,
      pnlPercent: invested ? round2((pnl / invested) * 100) : 0,
    };
  });
}

// Totals: Investment = sum(qty x avg price), Current = sum(qty x price), P&L = Current - Investment
export function summarize(rows) {
  const totalInvestment = round2(rows.reduce((s, r) => s + r.invested, 0));
  const currentValue = round2(rows.reduce((s, r) => s + r.currentValue, 0));
  const totalPnl = round2(currentValue - totalInvestment);
  const returnPercent = totalInvestment ? round2((totalPnl / totalInvestment) * 100) : 0;
  return { totalInvestment, currentValue, totalPnl, returnPercent };
}
