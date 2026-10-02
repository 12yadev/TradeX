import Stock from '../models/Stock.js';
import Order from '../models/Order.js';
import Holding from '../models/Holding.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import { AppError } from '../utils/AppError.js';
import { round2 } from '../utils/helpers.js';

// Recalculates margin figures. Simplified model:
//   usedMargin      = money tied up in open INTRADAY positions
//   availableMargin = cash available to trade with
export async function syncWallet(userId) {
  const wallet = await Wallet.findOne({ userId });
  const intraday = await Holding.find({ userId, product: 'INTRADAY' });
  wallet.usedMargin = round2(intraday.reduce((s, h) => s + h.quantity * h.averagePrice, 0));
  wallet.availableMargin = wallet.balance;
  await wallet.save();
  return wallet;
}

// A market order always fills; a limit order fills only when the price allows it
export const isExecutable = (order, price) =>
  order.orderType === 'MARKET' ||
  (order.transactionType === 'BUY' ? price <= order.price : price >= order.price);

// Fills an order at execPrice: moves cash, updates holdings, writes a transaction.
// Throws AppError if funds or holdings are insufficient.
export async function executeOrder(order, execPrice) {
  const { userId, symbol, transactionType, quantity, product } = order;
  const amount = round2(execPrice * quantity);
  const wallet = await Wallet.findOne({ userId });

  if (transactionType === 'BUY') {
    if (wallet.balance < amount) throw new AppError('Insufficient funds', 400);
    const holding = await Holding.findOne({ userId, symbol, product });
    if (holding) {
      const totalQty = holding.quantity + quantity;
      holding.averagePrice = round2((holding.averagePrice * holding.quantity + amount) / totalQty);
      holding.quantity = totalQty;
      holding.currentPrice = execPrice;
      await holding.save();
    } else {
      await Holding.create({
        userId, symbol, product, quantity,
        companyName: order.companyName,
        averagePrice: execPrice,
        currentPrice: execPrice,
      });
    }
    wallet.balance = round2(wallet.balance - amount);
  } else {
    const holding = await Holding.findOne({ userId, symbol, product });
    if (!holding || holding.quantity < quantity) throw new AppError('Insufficient holdings', 400);
    holding.quantity -= quantity;
    if (holding.quantity === 0) await holding.deleteOne();
    else await holding.save();
    wallet.balance = round2(wallet.balance + amount);
  }

  await wallet.save();
  order.price = execPrice;
  order.totalAmount = amount;
  order.status = 'COMPLETED';
  await order.save();
  await Transaction.create({ userId, type: transactionType, symbol, quantity, price: execPrice, amount });
  await syncWallet(userId);
  return order;
}

// Called by the price simulator: fills pending limit orders whose price condition is met
export async function matchPendingOrders() {
  const pending = await Order.find({ status: 'PENDING' });
  if (!pending.length) return;
  const stocks = await Stock.find({ symbol: { $in: [...new Set(pending.map((o) => o.symbol))] } });
  const prices = new Map(stocks.map((s) => [s.symbol, s.currentPrice]));
  for (const order of pending) {
    const price = prices.get(order.symbol);
    if (price === undefined || !isExecutable(order, price)) continue;
    try {
      await executeOrder(order, price);
    } catch (err) {
      if (!(err instanceof AppError)) throw err;
      order.status = 'REJECTED';
      await order.save();
    }
  }
}
