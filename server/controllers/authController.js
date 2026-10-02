import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Watchlist from '../models/Watchlist.js';
import Transaction from '../models/Transaction.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { signToken, safeUser } from '../utils/helpers.js';

const STARTING_BALANCE = 100000;
const DEFAULT_WATCHLIST = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK'];

export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (await User.findOne({ email: email.toLowerCase() })) {
    throw new AppError('An account with this email already exists', 409);
  }
  const user = await User.create({ name, email, phone, password });
  await Wallet.create({
    userId: user._id,
    balance: STARTING_BALANCE,
    usedMargin: 0,
    availableMargin: STARTING_BALANCE,
  });
  await Watchlist.create({ userId: user._id, stocks: DEFAULT_WATCHLIST });
  await Transaction.create({ userId: user._id, type: 'ADD_FUNDS', amount: STARTING_BALANCE });
  res.status(201).json({ token: signToken(user._id), user: safeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  // Same message for unknown email and wrong password (don't reveal which)
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  res.json({ token: signToken(user._id), user: safeUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: safeUser(req.user) });
});
