// Run with: npm run seed
// Wipes the TradeX collections and inserts 20 mock stocks plus a demo account.
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../utils/db.js';
import { seededRandom } from '../utils/random.js';
import { round2 } from '../utils/helpers.js';
import User from '../models/User.js';
import Stock from '../models/Stock.js';
import Watchlist from '../models/Watchlist.js';
import Order from '../models/Order.js';
import Holding from '../models/Holding.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';

// [symbol, company, sector, mock price, market cap (Rs crore)]
// All values are MOCK data for demonstration only.
const STOCKS = [
  ['RELIANCE', 'Reliance Industries', 'Energy', 2900, 1960000],
  ['TCS', 'Tata Consultancy Services', 'IT', 3850, 1390000],
  ['INFY', 'Infosys', 'IT', 1600, 665000],
  ['HDFCBANK', 'HDFC Bank', 'Banking', 1650, 1260000],
  ['ICICIBANK', 'ICICI Bank', 'Banking', 1200, 840000],
  ['SBIN', 'State Bank of India', 'Banking', 800, 715000],
  ['ITC', 'ITC Limited', 'FMCG', 460, 575000],
  ['LT', 'Larsen & Toubro', 'Infrastructure', 3500, 480000],
  ['WIPRO', 'Wipro', 'IT', 480, 250000],
  ['BHARTIARTL', 'Bharti Airtel', 'Telecom', 1500, 900000],
  ['AXISBANK', 'Axis Bank', 'Banking', 1150, 355000],
  ['MARUTI', 'Maruti Suzuki', 'Auto', 12500, 390000],
  ['TATAMOTORS', 'Tata Motors', 'Auto', 950, 350000],
  ['HCLTECH', 'HCL Technologies', 'IT', 1600, 435000],
  ['ASIANPAINT', 'Asian Paints', 'Consumer', 2800, 270000],
  ['SUNPHARMA', 'Sun Pharma', 'Pharma', 1700, 408000],
  ['TITAN', 'Titan Company', 'Consumer', 3400, 300000],
  ['BAJFINANCE', 'Bajaj Finance', 'Finance', 7000, 430000],
  ['ADANIENT', 'Adani Enterprises', 'Infrastructure', 2500, 285000],
  ['KOTAKBANK', 'Kotak Mahindra Bank', 'Banking', 1800, 360000],
];

const buildStock = ([symbol, companyName, sector, price, marketCap]) => {
  const rnd = seededRandom(symbol);
  const previousClose = round2(price * (0.985 + rnd() * 0.03));
  const open = round2(previousClose * (1 + (rnd() - 0.5) * 0.01));
  return {
    symbol, companyName, sector, marketCap,
    currentPrice: price,
    previousClose,
    open,
    high: round2(Math.max(price, open) * (1 + rnd() * 0.006)),
    low: round2(Math.min(price, open) * (1 - rnd() * 0.006)),
    week52High: round2(price * (1.08 + rnd() * 0.2)),
    week52Low: round2(price * (0.65 + rnd() * 0.2)),
    volume: Math.floor(1000000 + rnd() * 9000000),
  };
};

const daysAgo = (n, hour = 11) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 15, 0, 0);
  return d;
};

async function seed() {
  await connectDB();
  await Promise.all([User, Stock, Watchlist, Order, Holding, Transaction, Wallet].map((m) => m.deleteMany({})));

  await Stock.insertMany(STOCKS.map(buildStock));
  const stocks = await Stock.find();
  const nameOf = Object.fromEntries(stocks.map((s) => [s.symbol, s.companyName]));
  console.log(`Inserted ${stocks.length} stocks`);

  const user = await User.create({
    name: 'Demo Trader',
    email: 'demo@tradex.com',
    phone: '9876543210',
    password: 'Demo@12345',
    createdAt: daysAgo(45),
  });
  const userId = user._id;

  await Watchlist.create({
    userId,
    stocks: ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'LT', 'WIPRO', 'MARUTI'],
  });

  // symbol, qty, avg buy price, product, days ago
  const trades = [
    ['RELIANCE', 10, 2780, 'LONGTERM', 30],
    ['TCS', 5, 3650, 'LONGTERM', 28],
    ['INFY', 20, 1480, 'LONGTERM', 21],
    ['HDFCBANK', 15, 1590, 'LONGTERM', 18],
    ['ITC', 50, 420, 'LONGTERM', 14],
    ['SBIN', 25, 700, 'LONGTERM', 9],
    ['WIPRO', 30, 470, 'INTRADAY', 1],
    ['TATAMOTORS', 20, 930, 'INTRADAY', 0],
  ];

  const orders = [];
  const transactions = [
    { userId, type: 'ADD_FUNDS', amount: 300000, createdAt: daysAgo(40) },
  ];
  for (const [symbol, quantity, price, product, ago] of trades) {
    const amount = round2(quantity * price);
    orders.push({
      userId, symbol, companyName: nameOf[symbol], orderType: 'MARKET', transactionType: 'BUY',
      product, quantity, price, totalAmount: amount, status: 'COMPLETED', createdAt: daysAgo(ago),
    });
    transactions.push({ userId, type: 'BUY', symbol, quantity, price, amount, createdAt: daysAgo(ago) });
  }
  // A few more orders to show every status
  orders.push(
    { userId, symbol: 'MARUTI', companyName: nameOf.MARUTI, orderType: 'LIMIT', transactionType: 'BUY', product: 'LONGTERM', quantity: 2, price: 11800, totalAmount: 23600, status: 'PENDING', createdAt: daysAgo(0, 10) },
    { userId, symbol: 'TITAN', companyName: nameOf.TITAN, orderType: 'LIMIT', transactionType: 'BUY', product: 'LONGTERM', quantity: 4, price: 3200, totalAmount: 12800, status: 'CANCELLED', createdAt: daysAgo(5) },
    { userId, symbol: 'BAJFINANCE', companyName: nameOf.BAJFINANCE, orderType: 'MARKET', transactionType: 'BUY', product: 'LONGTERM', quantity: 100, price: 7000, totalAmount: 700000, status: 'REJECTED', createdAt: daysAgo(12) },
    { userId, symbol: 'AXISBANK', companyName: nameOf.AXISBANK, orderType: 'MARKET', transactionType: 'SELL', product: 'LONGTERM', quantity: 10, price: 1130, totalAmount: 11300, status: 'COMPLETED', createdAt: daysAgo(7) }
  );
  transactions.push({ userId, type: 'SELL', symbol: 'AXISBANK', quantity: 10, price: 1130, amount: 11300, createdAt: daysAgo(7) });

  await Order.insertMany(orders);
  await Transaction.insertMany(transactions);
  await Holding.insertMany(
    trades.map(([symbol, quantity, averagePrice, product]) => ({
      userId, symbol, quantity, averagePrice, product,
      companyName: nameOf[symbol],
      currentPrice: stocks.find((s) => s.symbol === symbol).currentPrice,
    }))
  );

  const usedMargin = round2(30 * 470 + 20 * 930);
  await Wallet.create({ userId, balance: 100000, usedMargin, availableMargin: 100000 });

  console.log('Demo account ready: demo@tradex.com / Demo@12345');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
