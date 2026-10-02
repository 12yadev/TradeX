import { useState } from 'react';
import toast from 'react-hot-toast';
import OrdersTable from '../components/OrdersTable';
import EmptyState from '../components/EmptyState';
import { SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getOrders, cancelOrder } from '../services/tradingService';
import { getErrorMessage } from '../services/api';

const FILTERS = ['All', 'Buy', 'Sell', 'Completed', 'Pending'];

export default function Orders() {
  const { refreshKey } = useTrade();
  const [filter, setFilter] = useState('All');
  const [version, setVersion] = useState(0);
  const { data, loading, error, reload } = useFetch(getOrders, [refreshKey, version], 20000);

  const all = data?.orders || [];
  const visible = all.filter((o) => {
    if (filter === 'Buy') return o.transactionType === 'BUY';
    if (filter === 'Sell') return o.transactionType === 'SELL';
    if (filter === 'Completed') return o.status === 'COMPLETED';
    if (filter === 'Pending') return o.status === 'PENDING';
    return true;
  });

  const handleCancel = async (order) => {
    if (!window.confirm(`Cancel pending ${order.transactionType} order for ${order.symbol}?`)) return;
    try {
      const res = await cancelOrder(order._id);
      toast.success(res.message);
      setVersion((v) => v + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <h4 className="fw-bold mb-0">Orders</h4>
      <div className="d-flex gap-2 flex-wrap">
        {FILTERS.map((f) => <button key={f} className={`filter-pill ${f === filter ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      {error && <ErrorBox message={error} onRetry={reload} />}
      <div className="tx-card">
        {loading ? <SkeletonRows rows={6} /> : visible.length === 0 ? (
          <EmptyState title="No orders yet." text={all.length ? 'No orders match this filter.' : 'Place a buy order from your watchlist to get started.'} actionLabel="Open watchlist" to="/watchlist" />
        ) : <OrdersTable orders={visible} onCancel={handleCancel} />}
      </div>
    </div>
  );
}
