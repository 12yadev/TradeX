import mongoose from 'mongoose';

// One document per user + stock + product (LONGTERM holding or INTRADAY position)
const holdingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  symbol: { type: String, required: true },
  companyName: String,
  product: { type: String, enum: ['LONGTERM', 'INTRADAY'], default: 'LONGTERM' },
  quantity: { type: Number, required: true, min: 0 },
  averagePrice: { type: Number, required: true },
  currentPrice: Number,
});
holdingSchema.index({ userId: 1, symbol: 1, product: 1 }, { unique: true });

export default mongoose.model('Holding', holdingSchema);
