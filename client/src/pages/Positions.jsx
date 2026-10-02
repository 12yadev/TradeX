import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getPositions } from '../services/tradingService';
import { formatINR, formatPct, formatSigned, pnlClass, productLabel } from '../utils/format';

const TABS = [['ALL', 'All'], ['INTRADAY', 'Intraday'], ['LONGTERM', 'Long-term']];

export default function Positions() {
  const { openTrade, refreshKey } = useTrade();
  const [tab, setTab] = useState('ALL');
  const { data, loading, error, reload } = useFetch(getPositions, [refreshKey], 20000);
  const rows = (data?.positions || []).filter((p) => tab === 'ALL' || p.product === tab);
  const totalPnl = rows.reduce((s, r) => s + r.pnl, 0);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between flex-wrap gap-2 align-items-end">
        <h4 className="fw-bold mb-0">Positions</h4>
        {!loading && <div>Total P&amp;L: <strong className={pnlClass(totalPnl)}>{formatSigned(totalPnl)}</strong></div>}
      </div>
      <div className="d-flex gap-2">
        {TABS.map(([k, l]) => <button key={k} className={`filter-pill ${k === tab ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {error && <ErrorBox message={error} onRetry={reload} />}
      <div className="tx-card">
        {loading ? <SkeletonRows rows={4} /> : rows.length === 0 ? (
          <EmptyState title="No open positions." text="Positions appear here after you place a buy order." actionLabel="Explore stocks" to="/watchlist" />
        ) : (
          <div className="table-responsive">
            <table className="table tx-table mb-0">
              <thead><tr><th>Stock</th><th>Product</th><th className="text-end">Qty</th><th className="text-end">Buy price</th><th className="text-end">Current price</th><th className="text-end">P&amp;L</th><th className="text-end">P&amp;L %</th><th /></tr></thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p._id}>
                    <td><Link to={`/stocks/${p.symbol}`} className="symbol-link">{p.symbol}</Link></td>
                    <td><span className={`badge ${p.product === 'INTRADAY' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-primary-subtle text-primary-emphasis'}`}>{productLabel(p.product)}</span></td>
                    <td className="text-end">{p.quantity}</td>
                    <td className="text-end">{formatINR(p.averagePrice)}</td>
                    <td className="text-end">{formatINR(p.currentPrice)}</td>
                    <td className={`text-end fw-semibold ${pnlClass(p.pnl)}`}>{formatSigned(p.pnl)}</td>
                    <td className={`text-end ${pnlClass(p.pnlPercent)}`}>{formatPct(p.pnlPercent)}</td>
                    <td className="text-end"><button className="btn btn-sell btn-xs" onClick={() => openTrade(p.symbol, 'SELL', p.product)}>Exit</button></td>
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
