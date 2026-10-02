import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiShield, FiPieChart, FiSearch, FiBarChart2, FiStar, FiLock, FiActivity, FiChevronDown } from 'react-icons/fi';
import Footer from '../components/Footer';

const WHY = [
  [FiShield, 'Risk-free practice', 'Trade with ₹1,00,000 of virtual money. Nothing real is ever at stake.'],
  [FiActivity, 'Realistic workflow', 'Market and limit orders, holdings, positions and P&L, just like a real trading app.'],
  [FiTrendingUp, 'Learn by doing', 'Build confidence with strategies before you ever think about real markets.'],
];
const FEATURES = [
  [FiSearch, 'Instant stock search', 'Find any listed company by name or symbol as you type.'],
  [FiStar, 'Personal watchlist', 'Track the stocks you care about and trade in one click.'],
  [FiBarChart2, 'Interactive charts', 'Switch between 1D, 1W, 1M, 6M, 1Y and 5Y views.'],
  [FiPieChart, 'Portfolio analytics', 'See allocation, top performers and profit or loss at a glance.'],
];
const FAQS = [
  ['Is this real trading?', 'No. TradeX is an educational paper-trading project. It does not execute real stock-market transactions or handle real money.'],
  ['Are the prices real-time?', 'No. Prices are mock data that move in small random steps so the app feels alive. They are not real market prices.'],
  ['Do I need to pay anything?', 'No. TradeX is free and uses only virtual funds that you can add to at any time.'],
  ['Is my password safe?', 'Passwords are hashed with bcrypt before they are stored and sessions use signed JWT tokens.'],
];
const TICKERS = [['NIFTY 50', '24,512.40', '+0.62%', true], ['SENSEX', '80,421.10', '+0.48%', true], ['NIFTY BANK', '51,840.75', '-0.21%', false], ['NIFTY IT', '38,610.30', '+1.12%', true]];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <>
      <section id="home" className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1>Invest Smarter. Trade Better.</h1>
              <p className="lead text-muted my-4">A simple and powerful platform to track markets, manage your portfolio and practice trading.</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/register" className="btn btn-primary btn-lg">Start Trading</Link>
                <a href="#products" className="btn btn-outline-primary btn-lg">Explore Markets</a>
              </div>
              <p className="small text-muted mt-3 mb-0">Paper trading only. No real money involved.</p>
            </div>
            <div className="col-lg-6">
              <div className="tx-card tx-card-body">
                <div className="d-flex justify-content-between mb-2"><strong>Market dashboard</strong><span className="badge bg-light text-muted">Sample data</span></div>
                <div className="row g-2">
                  {TICKERS.map(([n, v, c, up]) => (
                    <div className="col-6" key={n}>
                      <div className={`rounded p-3 ${up ? 'bg-profit-soft' : 'bg-loss-soft'}`}>
                        <div className="small text-muted">{n}</div>
                        <div className="fw-bold">{v}</div>
                        <div className={`small fw-semibold ${up ? 'text-profit' : 'text-loss'}`}>{c}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-4">Why TradeX?</h2>
          <div className="row g-4">
            {WHY.map(([Icon, t, d]) => (
              <div className="col-md-4" key={t}><div className="tx-card tx-card-body h-100"><span className="feature-icon mb-3"><Icon /></span><h5>{t}</h5><p className="text-muted mb-0">{d}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <h2 className="fw-bold text-center mb-1">Market features</h2>
          <p className="text-center text-muted mb-4">Everything you need to practice, in one dashboard.</p>
          <div className="row g-4">
            {FEATURES.map(([Icon, t, d]) => (
              <div className="col-sm-6 col-lg-3" key={t}><span className="feature-icon mb-3"><Icon /></span><h6 className="fw-bold">{t}</h6><p className="text-muted small">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h2 className="fw-bold">Portfolio management</h2>
              <p className="text-muted">Every buy and sell updates your holdings, average price and funds automatically. Profit and loss are calculated from your actual positions, never hardcoded.</p>
              <ul className="text-muted"><li>Holdings with invested value, current value and P&amp;L</li><li>Intraday and long-term positions</li><li>Asset allocation and performance charts</li></ul>
            </div>
            <div className="col-lg-6">
              <div className="tx-card tx-card-body">
                <div className="row text-center">
                  <div className="col-4"><div className="stat-label">Invested</div><div className="fw-bold">₹1,50,000</div></div>
                  <div className="col-4"><div className="stat-label">Current</div><div className="fw-bold">₹1,67,500</div></div>
                  <div className="col-4"><div className="stat-label">Return</div><div className="fw-bold text-profit">+11.67%</div></div>
                </div>
                <p className="small text-muted text-center mt-3 mb-0">Example figures for illustration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-5 bg-white border-top border-bottom">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Pricing</h2>
          <div className="tx-card tx-card-body mx-auto" style={{ maxWidth: 360 }}>
            <h5>Free forever</h5>
            <div className="display-6 fw-bold my-2">₹0</div>
            <ul className="list-unstyled text-muted">
              <li>₹1,00,000 virtual starting balance</li><li>Unlimited simulated orders</li><li>Watchlist, charts and analytics</li>
            </ul>
            <Link to="/register" className="btn btn-primary w-100">Create free account</Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="tx-card tx-card-body d-md-flex align-items-center gap-4">
            <span className="feature-icon"><FiLock /></span>
            <div>
              <h5 className="mb-1">Security</h5>
              <p className="text-muted mb-0">Passwords are hashed with bcrypt, sessions use JWT, dashboard routes are protected and all input is validated. We never ask for real banking details.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-5 bg-white border-top">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="fw-bold text-center mb-4">Frequently asked questions</h2>
          {FAQS.map(([q, a], i) => (
            <div className="tx-card mb-2" key={q}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>{q}<FiChevronDown style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }} /></button>
              {openFaq === i && <div className="px-3 pb-3 text-muted">{a}</div>}
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
