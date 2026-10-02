import { Skeleton } from './Loaders';

export default function StatCard({ label, value, sub, valueClass = '', loading = false }) {
  return (
    <div className="tx-card tx-card-body h-100">
      <div className="stat-label">{label}</div>
      {loading ? <Skeleton height={28} width="60%" /> : <div className={`stat-value ${valueClass}`}>{value}</div>}
      {sub && !loading && <div className={`small mt-1 ${valueClass}`}>{sub}</div>}
    </div>
  );
}
