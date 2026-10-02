import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { getFunds, addFunds, withdrawFunds, getTransactions } from '../controllers/fundsController.js';

const amountRule = body('amount')
  .isFloat({ gt: 0, max: 10000000 })
  .withMessage('Enter an amount between ₹1 and ₹1,00,00,000');

export const fundsRouter = Router()
  .get('/', getFunds)
  .post('/add', [amountRule], validate, addFunds)
  .post('/withdraw', [amountRule], validate, withdrawFunds);

export const transactionsRouter = Router().get('/', getTransactions);
