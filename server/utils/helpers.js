import jwt from 'jsonwebtoken';

export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const safeUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  createdAt: u.createdAt,
});

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
