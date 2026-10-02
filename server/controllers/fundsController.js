import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { round2 } from '../utils/helpers.js';
import { syncWallet } from '../services/tradeService.js';

export const getFunds = asyncHandler(async (req, res) => {
  const wallet = await syncWallet(req.user._id);
  res.json({ funds: wallet });
});

export const addFunds = asyncHandler(async (req, res) => {
  const amount = round2(req.body.amount);
  const wallet = await Wallet.findOne({ userId: req.user._id });
  wallet.balance = round2(wallet.balance + amount);
  await wallet.save();
  await Transaction.create({ userId: req.user._id, type: 'ADD_FUNDS', amount });
  res.json({ funds: await syncWallet(req.user._id), message: 'Virtual funds added successfully.' });
});

export const withdrawFunds = asyncHandler(async (req, res) => {
  const amount = round2(req.body.amount);
  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (wallet.balance < amount) throw new AppError('Insufficient funds', 400);
  wallet.balance = round2(wallet.balance - amount);
  await wallet.save();
  await Transaction.create({ userId: req.user._id, type: 'WITHDRAW', amount });
  res.json({ funds: await syncWallet(req.user._id), message: 'Virtual funds withdrawn successfully.' });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 100);
  res.json({ transactions });
});
