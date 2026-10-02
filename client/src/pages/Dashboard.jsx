import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import MarketSummary from '../components/MarketSummary';
import WatchlistPanel from '../components/WatchlistPanel';
import OrdersTable from '../components/OrdersTable';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { useAuth } from '../context/AuthContext';
import { getPortfolio, getOrders } from '../services/tradingService';
import { formatINR, formatPct, formatSigned, pnlClass } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const { refreshKey } = useTrade();
  const { data: pf, loading: pfLoading, error: pfError } = useFetch(getPortfolio, [refreshKey], 20000);
  const { data: ord, loading: ordLoading } = useFetch(() => getOrders({ limit: 5 }), [refreshKey]);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <h4 className="fw-bold mb-0">Hi, {user?.name?.split(' ')[0]}</h4>
        <small className="text-muted">Market values are simulated and not real-time.</small>
      </div>
      <MarketSummary />
      {pfError && <ErrorBox message={pfError} />}
      <div className="row g-3">
        <div className="col-6 col-lg-3"><StatCard loading={pfLoading} label="Total investment" value={formatINR(pf?.totalInvestment)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={pfLoading} label="Current value" value={formatINR(pf?.currentValue)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={pfLoading} label="Total P&L" value={formatSigned(pf?.totalPnl)} valueClass={pnlClass(pf?.totalPnl)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={pfLoading} label="Return" value={formatPct(pf?.returnPercent)} valueClass={pnlClass(pf?.returnPercent)} /></div>
      </div>
      <div className="row g-3">
        <div className="col-xl-7"><WatchlistPanel limit={8} /></div>
        <div className="col-xl-5">
          <div className="tx-card h-100">
            <div className="tx-card-body border-bottom"><h6 className="fw-bold mb-0">Portfolio performance (30 days)</h6></div>
            <div className="tx-card-body">
              {pfLoading ? <SkeletonRows rows={5} /> : pf?.performance?.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={pf.performance} margin={{ top: 5, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={30} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} width={62} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => [formatINR(v), 'Value']} />
                    <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <EmptyState title="No holdings available." text="Place your first buy order to see performance." actionLabel="Explore stocks" to="/watchlist" />}
            </div>
          </div>
        </div>
      </div>
      <div className="tx-card">
        <div className="tx-card-body border-bottom d-flex justify-content-between"><h6 className="fw-bold mb-0">Recent orders</h6><Link to="/orders" className="small">View all</Link></div>
        {ordLoading ? <SkeletonRows rows={3} /> : ord?.orders.length ? <OrdersTable orders={ord.orders} /> : <EmptyState title="No orders yet." text="Orders you place will show up here." actionLabel="Open watchlist" to="/watchlist" />}
      </div>
    </div>
  );
}
