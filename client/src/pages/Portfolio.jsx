import { Link } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getPortfolio } from '../services/tradingService';
import { formatINR, formatPct, formatSigned, pnlClass } from '../utils/format';

const COLORS = ['#1d4ed8', '#0f9d58', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#64748b', '#84cc16'];

function PerformerList({ title, items, empty }) {
  return (
    <div className="tx-card h-100">
      <div className="tx-card-body border-bottom"><h6 className="fw-bold mb-0">{title}</h6></div>
      {items.length === 0 ? <div className="tx-card-body text-muted small">{empty}</div> : items.map((r) => (
        <div key={r._id} className="d-flex justify-content-between px-3 py-2 border-bottom">
          <Link to={`/stocks/${r.symbol}`} className="symbol-link">{r.symbol}</Link>
          <span className={`fw-semibold ${pnlClass(r.pnl)}`}>{formatSigned(r.pnl)} ({formatPct(r.pnlPercent)})</span>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const { refreshKey } = useTrade();
  const { data: d, loading, error, reload } = useFetch(getPortfolio, [refreshKey], 20000);
  const empty = !loading && d && d.holdingsCount === 0;

  return (
    <div className="d-flex flex-column gap-3">
      <h4 className="fw-bold mb-0">Portfolio</h4>
      {error && <ErrorBox message={error} onRetry={reload} />}
      <div className="row g-3">
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Total investment" value={formatINR(d?.totalInvestment)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Current value" value={formatINR(d?.currentValue)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Total P&L" value={formatSigned(d?.totalPnl)} valueClass={pnlClass(d?.totalPnl)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Return" value={formatPct(d?.returnPercent)} valueClass={pnlClass(d?.returnPercent)} /></div>
      </div>
      {loading && <div className="tx-card"><SkeletonRows rows={6} /></div>}
      {empty && <div className="tx-card"><EmptyState title="No holdings available." text="Your charts will appear after your first trade." actionLabel="Explore stocks" to="/watchlist" /></div>}
      {!loading && d && !empty && (
        <>
          <div className="row g-3">
            <div className="col-lg-7">
              <div className="tx-card tx-card-body">
                <h6 className="fw-bold">Portfolio performance</h6>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={d.performance} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} width={62} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [formatINR(v), 'Value']} />
                    <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="small text-muted">Illustrative 30-day curve ending at your current value.</div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="tx-card tx-card-body">
                <h6 className="fw-bold">Asset allocation by sector</h6>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={d.allocation} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                      {d.allocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatINR(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="tx-card tx-card-body">
            <h6 className="fw-bold">Profit &amp; loss by stock</h6>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={d.pnlBySymbol} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                <XAxis dataKey="symbol" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={62} />
                <Tooltip formatter={(v) => [formatSigned(v), 'P&L']} />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {d.pnlBySymbol.map((r, i) => <Cell key={i} fill={r.pnl >= 0 ? '#0f9d58' : '#e53935'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="row g-3">
            <div className="col-md-6"><PerformerList title="Top performing stocks" items={d.topPerformers} empty="No stocks in profit yet." /></div>
            <div className="col-md-6"><PerformerList title="Worst performing stocks" items={d.worstPerformers} empty="No stocks in loss. Nice." /></div>
          </div>
        </>
      )}
    </div>
  );
}
