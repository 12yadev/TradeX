import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiStar, FiX, FiPlus } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getWatchlist, getStocks, addToWatchlist, removeFromWatchlist } from '../services/tradingService';
import { getErrorMessage } from '../services/api';
import { formatINR } from '../utils/format';
import PriceChange from './PriceChange';
import EmptyState from './EmptyState';
import { SkeletonRows, ErrorBox } from './Loaders';

// Watchlist with search, sort, add, remove and Buy/Sell buttons
export default function WatchlistPanel({ limit }) {
  const { openTrade, refreshKey } = useTrade();
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('added');
  const [toAdd, setToAdd] = useState('');
  const [version, setVersion] = useState(0);

  const { data, loading, error, reload } = useFetch(getWatchlist, [version, refreshKey], 20000);
  const { data: all } = useFetch(() => getStocks(), []);

  const stocks = useMemo(() => {
    let list = [...(data?.stocks || [])];
    if (filter) list = list.filter((s) => `${s.symbol} ${s.companyName}`.toLowerCase().includes(filter.toLowerCase()));
    const sorters = {
      name: (a, b) => a.symbol.localeCompare(b.symbol),
      price: (a, b) => b.currentPrice - a.currentPrice,
      change: (a, b) => b.changePercent - a.changePercent,
    };
    if (sorters[sort]) list.sort(sorters[sort]);
    return limit ? list.slice(0, limit) : list;
  }, [data, filter, sort, limit]);

  const available = (all?.stocks || []).filter((s) => !data?.stocks.some((w) => w.symbol === s.symbol));

  const add = async () => {
    if (!toAdd) return;
    try {
      const res = await addToWatchlist(toAdd);
      toast.success(res.message);
      setToAdd(''); setVersion((v) => v + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };
  const remove = async (symbol) => {
    try {
      const res = await removeFromWatchlist(symbol);
      toast.success(res.message);
      setVersion((v) => v + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="tx-card">
      <div className="tx-card-body border-bottom">
        <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
          <h6 className="fw-bold mb-0 d-flex align-items-center gap-2"><FiStar /> Watchlist <span className="badge bg-light text-muted">{data?.stocks.length ?? 0}</span></h6>
          <div className="d-flex flex-wrap gap-2">
            <input className="form-control form-control-sm" style={{ width: 150 }} placeholder="Filter..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            <select className="form-select form-select-sm" style={{ width: 140 }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="added">Sort: Added</option>
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
              <option value="change">Sort: % Change</option>
            </select>
          </div>
        </div>
        <div className="d-flex gap-2 mt-2">
          <select className="form-select form-select-sm" value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
            <option value="">Add a stock to watchlist...</option>
            {available.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol} – {s.companyName}</option>)}
          </select>
          <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={add} disabled={!toAdd}><FiPlus /> Add</button>
        </div>
      </div>

      {error && <div className="p-3"><ErrorBox message={error} onRetry={reload} /></div>}
      {loading ? <SkeletonRows rows={6} /> : stocks.length === 0 ? (
        <EmptyState
          title={filter ? 'No stocks match your filter' : 'No stocks in your watchlist.'}
          text={filter ? 'Try a different name or symbol.' : 'Use the selector above to add your first stock.'}
        />
      ) : (
        <div className="table-responsive">
          <table className="table tx-table mb-0">
            <thead><tr><th>Stock</th><th className="text-end">Price</th><th className="text-end">Change</th><th className="text-end">Trade</th></tr></thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s.symbol}>
                  <td>
                    <Link to={`/stocks/${s.symbol}`} className="symbol-link">{s.symbol}</Link>
                    <div className="small text-muted">{s.companyName}</div>
                  </td>
                  <td className="text-end fw-semibold">{formatINR(s.currentPrice)}</td>
                  <td className="text-end"><PriceChange percent={s.changePercent} /></td>
                  <td className="text-end">
                    <button className="btn btn-buy btn-xs me-1" onClick={() => openTrade(s.symbol, 'BUY')}>Buy</button>
                    <button className="btn btn-sell btn-xs me-1" onClick={() => openTrade(s.symbol, 'SELL')}>Sell</button>
                    <button className="btn btn-link btn-sm text-muted p-0" title="Remove" onClick={() => remove(s.symbol)}><FiX /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
