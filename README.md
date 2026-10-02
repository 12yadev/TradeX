# TradeX – Stock Trading Platform

An original, full-stack **paper-trading** platform built with the MERN stack. Practice trading Indian stocks with virtual money, track a watchlist, place simulated buy/sell orders, and analyse your portfolio.

> **TradeX is an educational paper-trading project and does not execute real stock-market transactions.**
> All stock prices, indices and chart history are **mock/simulated data** and are **not real-time**. No real money, brokerage accounts or banking details are involved.

## Features

- Register / login with JWT, bcrypt password hashing, "keep me logged in" option, protected routes
- Landing page with hero, features, pricing, security and FAQ
- Dashboard: market summary (NIFTY 50, SENSEX, NIFTY BANK, NIFTY IT), portfolio stats, watchlist, performance chart, recent orders
- Watchlist: add, remove, filter, sort, Buy/Sell buttons
- Global debounced stock search (`TCS` → `TCS – Tata Consultancy Services` → `/stocks/TCS`)
- Stock details with 1D / 1W / 1M / 6M / 1Y / 5Y interactive charts
- Simulated Buy and Sell, Market and Limit orders (limit orders stay *Pending* until the simulated price reaches them; pending orders can be cancelled)
- Orders (with filters), Holdings, Positions (intraday and long-term), Portfolio analytics (performance line chart, sector donut, P&L bar chart, top/worst performers)
- Funds: add or withdraw virtual money, transaction history
- Profile: update name/phone, change password
- Toast notifications, skeleton loaders, empty states, responsive layout with mobile sidebar
- 20 seeded Indian companies plus a demo account with sample data

## Tech stack

| Layer | Tools |
|-------|-------|
| Frontend | React 18, Vite, JavaScript, React Router DOM, Bootstrap 5, CSS, Axios, Recharts, React Icons, react-hot-toast |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-validator |

## Screenshots

Add your own screenshots to a `screenshots/` folder and link them here:

```
![Landing](screenshots/landing.png)
![Dashboard](screenshots/dashboard.png)
![Stock details](screenshots/stock-details.png)
![Portfolio](screenshots/portfolio.png)
```

## Folder structure

```
TradeX/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/   reusable UI (navbar, sidebar, modal, charts, loaders...)
│   │   ├── context/      AuthContext, TradeContext
│   │   ├── hooks/        useFetch, useDebounce
│   │   ├── layouts/      PublicLayout, AppLayout
│   │   ├── pages/        Landing, Login, Register, Dashboard, Watchlist, ...
│   │   ├── services/     api.js (Axios), tradingService.js (API calls)
│   │   ├── utils/        format.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── controllers/
│   ├── middleware/       auth, validation, error handling
│   ├── models/
│   ├── routes/
│   ├── seed/seed.js
│   ├── services/         trade engine, price simulator, chart history
│   ├── utils/
│   ├── server.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 20+ and npm
- MongoDB (local install **or** a free MongoDB Atlas cluster)

### 1. MongoDB setup

**Option A: Local MongoDB**
1. Install MongoDB Community Edition and start it (`mongod`, or the MongoDB service on Windows/macOS).
2. Use `MONGO_URI=mongodb://127.0.0.1:27017/tradex`.

**Option B: MongoDB Atlas (cloud)**
1. Create a free cluster at mongodb.com/atlas.
2. Database Access: create a user. Network Access: allow your IP (or `0.0.0.0/0` for testing).
3. Click Connect → Drivers and copy the connection string, for example
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/tradex`.

### 2. Environment setup

```bash
cp server/.env.example server/.env     # then edit server/.env
cp client/.env.example client/.env
```

Set `MONGO_URI` and a long random `JWT_SECRET` in `server/.env`. Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit `.env` files.

### 3. Backend

```bash
cd server
npm install
npm run seed     # inserts 20 stocks + demo account (re-run any time to reset)
npm run dev      # http://localhost:5000
```

Expected output: `MongoDB connected: ...` then `TradeX server running on http://localhost:5000`.
Check `http://localhost:5000/api/health`.

### 4. Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev      # http://localhost:5173
```

## Demo credentials

| Email | Password |
|-------|----------|
| `demo@tradex.com` | `Demo@12345` |

The demo account has ₹1,00,000 virtual balance, a 10-stock watchlist, sample holdings, intraday positions, orders (including pending, cancelled and rejected) and transactions. On the login page you can also click **Fill demo account**.

## API documentation

Base URL: `http://localhost:5000/api`. Routes marked 🔒 need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API status |
| POST | `/auth/register` | Create account `{name,email,phone,password}` → `{token,user}` |
| POST | `/auth/login` | Log in `{email,password}` → `{token,user}` |
| GET 🔒 | `/auth/me` | Current user |
| GET | `/stocks?q=&limit=` | List or search stocks |
| GET | `/stocks/:symbol` | Single stock |
| GET | `/stocks/:symbol/history?period=1M` | Mock chart history (1D, 1W, 1M, 6M, 1Y, 5Y) |
| GET | `/stocks/indices/summary` | Simulated index values |
| GET 🔒 | `/watchlist` | Watchlist stocks |
| POST 🔒 | `/watchlist` | Add `{symbol}` |
| DELETE 🔒 | `/watchlist/:symbol` | Remove stock |
| GET 🔒 | `/orders?status=&type=` | Order history |
| POST 🔒 | `/orders` | Place order `{symbol,transactionType:BUY\|SELL,quantity,orderType:MARKET\|LIMIT,price?,product:LONGTERM\|INTRADAY}` |
| DELETE 🔒 | `/orders/:id` | Cancel a pending order |
| GET 🔒 | `/holdings` | Long-term holdings + summary |
| GET 🔒 | `/positions` | Intraday and long-term positions |
| GET 🔒 | `/portfolio` | Totals, allocation, performers, performance series |
| GET 🔒 | `/funds` | Balance and margins |
| POST 🔒 | `/funds/add` | `{amount}` |
| POST 🔒 | `/funds/withdraw` | `{amount}` |
| GET 🔒 | `/transactions` | Transaction history |
| GET 🔒 | `/user/profile` | Profile |
| PUT 🔒 | `/user/profile` | Update `{name,phone}` |
| PUT 🔒 | `/user/password` | `{currentPassword,newPassword}` |

### How calculations work

- Total Investment = Σ(quantity × average buy price)
- Current Value = Σ(quantity × current price)
- P&L = Current Value − Total Investment; Return % = P&L ÷ Investment × 100
- Buying an existing stock recalculates the weighted average price.
- Simplified margin model: used margin = money in open intraday positions; available margin = cash balance.

### Simulated market

Every 20 seconds the server nudges each stock price by a small random amount and checks pending limit orders. Set `MARKET_SIMULATOR=off` in `server/.env` to freeze prices.

## Deployment

**Backend (Render / Railway)**
1. Push the repo to GitHub. Create a Web Service with root directory `server`, build command `npm install`, start command `npm start`.
2. Set environment variables: `MONGO_URI` (Atlas), `JWT_SECRET`, `CLIENT_URL` (your frontend URL, no trailing slash).
3. Run `npm run seed` once against your Atlas database (locally, with `MONGO_URI` pointing at Atlas).

**Frontend (Vercel / Netlify)**
1. Root directory `client`, build command `npm run build`, output directory `dist`.
2. Set `VITE_API_URL=https://your-backend-url/api`.
3. Add a rewrite so all paths serve `index.html` (Vercel: `vercel.json` with `{"rewrites":[{"source":"/(.*)","destination":"/"}]}`; Netlify: `_redirects` file containing `/* /index.html 200`).

## Future improvements

- Real market data provider (clearly labelled, with licensing) in place of mock data
- WebSocket price streaming
- Stop-loss and bracket orders; brokerage and tax simulation
- Refresh tokens and httpOnly cookie auth
- Automated tests (Jest, Supertest, React Testing Library)
- Price alerts, news feed, dark mode

## Disclaimer

TradeX is an educational paper-trading project and does not execute real stock-market transactions. It is not financial advice. It is an original design and does not use any proprietary code, logos or branding from any brokerage.
