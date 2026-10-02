import mongoose from 'mongoose';
import { round2 } from '../utils/helpers.js';

const stockSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, unique: true, uppercase: true, trim: true },
    companyName: { type: String, required: true },
    sector: String,
    currentPrice: { type: Number, required: true },
    previousClose: Number,
    open: Number,
    high: Number,
    low: Number,
    week52High: Number,
    week52Low: Number,
    marketCap: Number, // in crore rupees
    volume: Number,
  },
  { toJSON: { virtuals: true, versionKey: false, id: false } }
);

stockSchema.virtual('change').get(function () {
  return round2(this.currentPrice - this.previousClose);
});
stockSchema.virtual('changePercent').get(function () {
  return this.previousClose ? round2(((this.currentPrice - this.previousClose) / this.previousClose) * 100) : 0;
});

export default mongoose.model('Stock', stockSchema);
