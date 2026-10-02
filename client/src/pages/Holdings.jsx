import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getHoldings } from '../services/tradingService';
import { formatINR, formatPct, formatSigned, pnlClass } from '../utils/format';

export default function Holdings() {
  const { openTrade, refreshKey } = useTrade();
  const { data, loading, error, reload } = useFetch(getHoldings, [refreshKey], 20000);
  const s = data?.summary;

  return (
    <div className="d-flex flex-column gap-3">
      <h4 className="fw-bold mb-0">Holdings</h4>
      <div className="row g-3">
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Total investment" value={formatINR(s?.totalInvestment)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Current value" value={formatINR(s?.currentValue)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="Total P&L" value={formatSigned(s?.totalPnl)} valueClass={pnlClass(s?.totalPnl)} /></div>
        <div className="col-6 col-lg-3"><StatCard loading={loading} label="P&L %" value={formatPct(s?.returnPercent)} valueClass={pnlClass(s?.returnPercent)} /></div>
      </div>
      {error && <ErrorBox message={error} onRetry={reload} />}
      <div className="tx-card">
        {loading ? <SkeletonRows rows={5} /> : data?.holdings.length === 0 ? (
          <EmptyState title="No holdings available." text="Buy a stock and it will appear here." actionLabel="Explore stocks" to="/watchlist" />
        ) : (
          <div className="table-responsive">
            <table className="table tx-table mb-0">
              <thead><tr><th>Stock</th><th className="text-end">Qty</th><th className="text-end">Avg price</th><th className="text-end">Current price</th><th className="text-end">Invested</th><th className="text-end">Current value</th><th className="text-end">P&amp;L</th><th /></tr></thead>
              <tbody>
                {data.holdings.map((h) => (
                  <tr key={h._id}>
                    <td><Link to={`/stocks/${h.symbol}`} className="symbol-link">{h.symbol}</Link><div className="small text-muted">{h.companyName}</div></td>
                    <td className="text-end">{h.quantity}</td>
                    <td className="text-end">{formatINR(h.averagePrice)}</td>
                    <td className="text-end">{formatINR(h.currentPrice)}</td>
                    <td className="text-end">{formatINR(h.invested)}</td>
                    <td className="text-end">{formatINR(h.currentValue)}</td>
                    <td className={`text-end fw-semibold ${pnlClass(h.pnl)}`}>{formatSigned(h.pnl)}<div className="small">{formatPct(h.pnlPercent)}</div></td>
                    <td className="text-end">
                      <button className="btn btn-buy btn-xs me-1" onClick={() => openTrade(h.symbol, 'BUY', h.product)}>Buy</button>
                      <button className="btn btn-sell btn-xs" onClick={() => openTrade(h.symbol, 'SELL', h.product)}>Sell</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
