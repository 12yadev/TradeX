import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/AppError.js';

// Verifies the JWT in the Authorization header and attaches req.user
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Not authorized. Please log in.', 401);
  }
  let decoded;
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    throw new AppError('Session expired. Please log in again.', 401);
  }
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('Account no longer exists.', 401);
  req.user = user;
  next();
});
