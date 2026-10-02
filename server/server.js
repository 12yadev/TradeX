import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';
import { startMarketSimulator } from './services/marketSimulator.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Add it to server/.env');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React app (one or more comma-separated origins) to call this API
const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '100kb' }));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`TradeX server running on http://localhost:${PORT}`));
  startMarketSimulator();
});
