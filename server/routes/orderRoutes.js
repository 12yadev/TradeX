import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { getOrders, createOrder, cancelOrder } from '../controllers/orderController.js';

const router = Router();
router.get('/', getOrders);
router.post(
  '/',
  [
    body('symbol').trim().notEmpty().withMessage('Stock symbol is required'),
    body('transactionType').isIn(['BUY', 'SELL']).withMessage('Transaction type must be BUY or SELL'),
    body('orderType').isIn(['MARKET', 'LIMIT']).withMessage('Order type must be MARKET or LIMIT'),
    body('product').optional().isIn(['LONGTERM', 'INTRADAY']).withMessage('Invalid product type'),
    body('quantity').isInt({ min: 1, max: 100000 }).withMessage('Quantity must be a whole number of at least 1'),
    body('price').if(body('orderType').equals('LIMIT')).isFloat({ gt: 0 }).withMessage('Enter a valid limit price'),
  ],
  validate,
  createOrder
);
router.delete('/:id', cancelOrder);
export default router;
