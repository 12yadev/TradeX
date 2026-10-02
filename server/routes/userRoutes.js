import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { passwordRule } from './authRoutes.js';
import { getProfile, updateProfile, changePassword } from '../controllers/userController.js';

const router = Router();
router.get('/profile', getProfile);
router.put(
  '/profile',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone').trim().matches(/^\+?\d{10,13}$/).withMessage('Enter a valid phone number'),
  ],
  validate,
  updateProfile
);
router.put(
  '/password',
  [body('currentPassword').notEmpty().withMessage('Current password is required'), passwordRule('newPassword')],
  validate,
  changePassword
);
export default router;
