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

// CORS setup: Localhost + dynamic Vercel domains + CLIENT_URL allow karein
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map(s => s.trim()) : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Mobile apps, Postman ya same-origin ke liye origin undefined hota hai
    if (!origin) return callback(null, true);

    // Agar origin list me hai YA kisi bhi .vercel.app domain se aa raha hai
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    return callback(new Error('Blocked by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Preflight OPTIONS requests allow karein
app.options('*', cors());

app.use(express.json({ limit: '100kb' }));

// Agar frontend bina /api ke call kar raha ho, tab bhi work kare
app.use('/api', routes);
app.use('/', routes); 

app.get("/", (req, res) => {
  res.send("TradeX Backend is running");
});

app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`TradeX server running on http://localhost:${PORT}`));
  startMarketSimulator();
});