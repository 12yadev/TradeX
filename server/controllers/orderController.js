import Order from '../models/Order.js';
import Stock from '../models/Stock.js';
import Holding from '../models/Holding.js';
import Wallet from '../models/Wallet.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { round2 } from '../utils/helpers.js';
import { executeOrder, isExecutable } from '../services/tradeService.js';

export const getOrders = asyncHandler(async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.status) filter.status = String(req.query.status).toUpperCase();
  if (req.query.type) filter.transactionType = String(req.query.type).toUpperCase();
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(Number(req.query.limit) || 200);
  res.json({ orders });
});

export const createOrder = asyncHandler(async (req, res) => {
  const { transactionType, orderType, product = 'LONGTERM' } = req.body;
  const userId = req.user._id;
  const symbol = req.body.symbol.toUpperCase();
  const quantity = Number(req.body.quantity);

  const stock = await Stock.findOne({ symbol });
  if (!stock) throw new AppError('Invalid stock symbol', 404);

  // Market orders use the current price; limit orders use the user's price
  const orderPrice = orderType === 'LIMIT' ? round2(req.body.price) : stock.currentPrice;

  // Pre-checks so users get an immediate, clear error
  if (transactionType === 'SELL') {
    const holding = await Holding.findOne({ userId, symbol, product });
    if (!holding || holding.quantity < quantity) throw new AppError('Insufficient holdings', 400);
  } else {
    const wallet = await Wallet.findOne({ userId });
    if (wallet.balance < round2(orderPrice * quantity)) throw new AppError('Insufficient funds', 400);
  }

  const order = await Order.create({
    userId, symbol, orderType, transactionType, product, quantity,
    companyName: stock.companyName,
    price: orderPrice,
    totalAmount: round2(orderPrice * quantity),
    status: 'PENDING',
  });

  if (!isExecutable(order, stock.currentPrice)) {
    return res.status(201).json({ order, message: 'Limit order placed. It is pending until the price is reached.' });
  }

  try {
    await executeOrder(order, stock.currentPrice);
  } catch (err) {
    if (err instanceof AppError) {
      order.status = 'REJECTED';
      await order.save();
    }
    throw err;
  }
  res.status(201).json({ order, message: 'Order placed successfully.' });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) throw new AppError('Order not found', 404);
  if (order.status !== 'PENDING') throw new AppError('Only pending orders can be cancelled', 400);
  order.status = 'CANCELLED';
  await order.save();
  res.json({ order, message: 'Order cancelled.' });
});
