import { getIndices } from '../services/tradingService';
import useFetch from '../hooks/useFetch';
import { formatNumber, pnlClass } from '../utils/format';
import PriceChange from './PriceChange';
import { SkeletonCard } from './Loaders';

// NIFTY 50, SENSEX, NIFTY BANK, NIFTY IT (simulated values)
export default function MarketSummary() {
  const { data, loading } = useFetch(getIndices, [], 60000);
  return (
    <div className="row g-3">
      {loading
        ? [1, 2, 3, 4].map((i) => <div className="col-6 col-xl-3" key={i}><SkeletonCard /></div>)
        : data?.indices.map((idx) => (
            <div className="col-6 col-xl-3" key={idx.name}>
              <div className="tx-card tx-card-body h-100" style={{ borderLeft: `4px solid ${idx.changePercent >= 0 ? 'var(--tx-green)' : 'var(--tx-red)'}` }}>
                <div className="stat-label">{idx.name}</div>
                <div className={`stat-value ${pnlClass(idx.changePercent)}`}>{formatNumber(idx.value.toFixed(2))}</div>
                <div className="small"><PriceChange percent={idx.changePercent} /></div>
              </div>
            </div>
          ))}
    </div>
  );
}
