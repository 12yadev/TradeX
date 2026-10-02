import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import { register, login, getMe } from '../controllers/authController.js';

const router = Router();

export const passwordRule = (field) =>
  body(field)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage('Password needs 8+ characters with upper-case, lower-case and a number');

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').trim().isEmail().withMessage('Enter a valid email address'),
    body('phone').trim().matches(/^\+?\d{10,13}$/).withMessage('Enter a valid phone number'),
    passwordRule('password'),
  ],
  validate,
  register
);
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);
router.get('/me', protect, getMe);

export default router;
