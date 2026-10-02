import Watchlist from '../models/Watchlist.js';
import Stock from '../models/Stock.js';
import { AppError, asyncHandler } from '../utils/AppError.js';

const getOrCreate = async (userId) =>
  (await Watchlist.findOne({ userId })) || Watchlist.create({ userId, stocks: [] });

export const getWatchlist = asyncHandler(async (req, res) => {
  const wl = await getOrCreate(req.user._id);
  const stocks = await Stock.find({ symbol: { $in: wl.stocks } });
  // Keep the order the user added them in
  stocks.sort((a, b) => wl.stocks.indexOf(a.symbol) - wl.stocks.indexOf(b.symbol));
  res.json({ stocks });
});

export const addToWatchlist = asyncHandler(async (req, res) => {
  const symbol = req.body.symbol.toUpperCase();
  if (!(await Stock.exists({ symbol }))) throw new AppError('Invalid stock symbol', 404);
  const wl = await getOrCreate(req.user._id);
  if (wl.stocks.includes(symbol)) throw new AppError('Stock is already in your watchlist', 409);
  wl.stocks.push(symbol);
  await wl.save();
  res.status(201).json({ message: 'Stock added to watchlist.', symbols: wl.stocks });
});

export const removeFromWatchlist = asyncHandler(async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const wl = await getOrCreate(req.user._id);
  if (!wl.stocks.includes(symbol)) throw new AppError('Stock is not in your watchlist', 404);
  wl.stocks = wl.stocks.filter((s) => s !== symbol);
  await wl.save();
  res.json({ message: 'Stock removed from watchlist.', symbols: wl.stocks });
});
