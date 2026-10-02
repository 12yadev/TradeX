import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true },
  companyName: String,
  orderType: { type: String, enum: ['MARKET', 'LIMIT'], required: true },
  transactionType: { type: String, enum: ['BUY', 'SELL'], required: true },
  product: { type: String, enum: ['LONGTERM', 'INTRADAY'], default: 'LONGTERM' },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] },
  price: { type: Number, required: true, min: [0.01, 'Price must be greater than 0'] },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['COMPLETED', 'PENDING', 'CANCELLED', 'REJECTED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
