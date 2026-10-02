import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/AppError.js';
import { safeUser } from '../utils/helpers.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: safeUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  req.user.name = req.body.name;
  req.user.phone = req.body.phone;
  await req.user.save();
  res.json({ user: safeUser(req.user), message: 'Profile updated successfully.' });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 400);
  }
  user.password = newPassword; // hashed by the model's pre-save hook
  await user.save();
  res.json({ message: 'Password changed successfully.' });
});
