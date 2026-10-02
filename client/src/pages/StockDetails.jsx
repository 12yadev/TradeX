import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';
import StockChart from '../components/StockChart';
import PriceChange from '../components/PriceChange';
import EmptyState from '../components/EmptyState';
import { Skeleton, SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getStock, getHistory, getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/tradingService';
import { getErrorMessage } from '../services/api';
import { formatINR, formatNumber, formatCrore } from '../utils/format';

const PERIODS = ['1D', '1W', '1M', '6M', '1Y', '5Y'];

export default function StockDetails() {
  const { symbol } = useParams();
  const { openTrade } = useTrade();
  const [period, setPeriod] = useState('1M');
  const [wlVersion, setWlVersion] = useState(0);

  const { data, loading, error } = useFetch(() => getStock(symbol), [symbol], 20000);
  const { data: hist, loading: histLoading } = useFetch(() => getHistory(symbol, period), [symbol, period]);
  const { data: wl } = useFetch(getWatchlist, [wlVersion]);

  if (error) {
    return <div className="container"><EmptyState title="Stock not found" text={error} actionLabel="Back to watchlist" to="/watchlist" /></div>;
  }
  const s = data?.stock;
  const inWatchlist = wl?.stocks.some((w) => w.symbol === symbol.toUpperCase());

  const toggleWatchlist = async () => {
    try {
      const res = inWatchlist ? await removeFromWatchlist(s.symbol) : await addToWatchlist(s.symbol);
      toast.success(res.message);
      setWlVersion((v) => v + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  const stats = s && [
    ['Previous close', formatINR(s.previousClose)], ['Open', formatINR(s.open)],
    ['Day high', formatINR(s.high)], ['Day low', formatINR(s.low)],
    ['52-week high', formatINR(s.week52High)], ['52-week low', formatINR(s.week52Low)],
    ['Market cap', formatCrore(s.marketCap)], ['Volume', formatNumber(s.volume)],
  ];

  return (
    <div className="d-flex flex-column gap-3">
      <div><Link to="/watchlist" className="small">← Watchlist</Link></div>
      <div className="tx-card tx-card-body">
        {loading || !s ? <><Skeleton height={26} width="40%" className="mb-2" /><Skeleton height={36} width="25%" /></> : (
          <div className="d-flex flex-wrap justify-content-between gap-3 align-items-start">
            <div>
              <h4 className="fw-bold mb-0">{s.companyName}</h4>
              <div className="text-muted">{s.symbol} · {s.sector}</div>
              <div className="mt-2 d-flex align-items-baseline gap-3 flex-wrap">
                <span className="fs-2 fw-bold">{formatINR(s.currentPrice)}</span>
                <PriceChange percent={s.changePercent} amount={s.change} />
              </div>
              <div className="small text-muted">Simulated price, not real-time</div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-buy" onClick={() => openTrade(s.symbol, 'BUY')}>Buy</button>
              <button className="btn btn-sell" onClick={() => openTrade(s.symbol, 'SELL')}>Sell</button>
              <button className={`btn ${inWatchlist ? 'btn-warning' : 'btn-outline-secondary'} d-flex align-items-center gap-1`} onClick={toggleWatchlist}>
                <FiStar /> {inWatchlist ? 'In watchlist' : 'Add to watchlist'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="tx-card">
        <div className="tx-card-body border-bottom d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <h6 className="fw-bold mb-0">Price chart</h6>
          <div className="d-flex gap-1 flex-wrap">
            {PERIODS.map((p) => <button key={p} className={`filter-pill ${p === period ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>)}
          </div>
        </div>
        <div className="tx-card-body">
          {histLoading || !hist ? <SkeletonRows rows={6} /> : <StockChart data={hist.history} />}
          <div className="small text-muted mt-2">Historical data is mock data generated for demonstration.</div>
        </div>
      </div>

      <div className="row g-3">
        {(stats || Array.from({ length: 8 })).map((st, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="tx-card tx-card-body h-100">
              {st ? <><div className="stat-label">{st[0]}</div><div className="fw-semibold">{st[1]}</div></> : <Skeleton height={34} />}
            </div>
          </div>
        ))}
      </div>
      {error && <ErrorBox message={error} />}
    </div>
  );
}
