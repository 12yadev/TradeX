import { useState } from 'react';
import toast from 'react-hot-toast';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { SkeletonRows, ErrorBox } from '../components/Loaders';
import useFetch from '../hooks/useFetch';
import { useTrade } from '../context/TradeContext';
import { getFunds, addFunds, withdrawFunds, getTransactions } from '../services/tradingService';
import { getErrorMessage } from '../services/api';
import { formatINR, formatDate } from '../utils/format';

const TYPE_STYLE = { BUY: 'text-primary', SELL: 'text-loss', ADD_FUNDS: 'text-profit', WITHDRAW: 'text-loss' };
const TYPE_LABEL = { BUY: 'Buy', SELL: 'Sell', ADD_FUNDS: 'Funds added', WITHDRAW: 'Withdrawal' };

export default function Funds() {
  const { refreshKey } = useTrade();
  const [version, setVersion] = useState(0);
  const [mode, setMode] = useState(null); // 'add' | 'withdraw' | null
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const { data: f, loading, error, reload } = useFetch(getFunds, [refreshKey, version]);
  const { data: tx, loading: txLoading } = useFetch(getTransactions, [refreshKey, version]);

  const submit = async (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!(value > 0)) return toast.error('Enter an amount greater than 0.');
    setBusy(true);
    try {
      const res = mode === 'add' ? await addFunds(value) : await withdrawFunds(value);
      toast.success(res.message);
      setAmount(''); setMode(null); setVersion((v) => v + 1);
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setBusy(false); }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <h4 className="fw-bold mb-0">Funds</h4>
      <div className="alert alert-info small mb-0">This is virtual money for practice. No real payments are involved.</div>
      {error && <ErrorBox message={error} onRetry={reload} />}
      <div className="row g-3">
        <div className="col-md-4"><StatCard loading={loading} label="Available balance" value={formatINR(f?.funds.balance)} /></div>
        <div className="col-md-4"><StatCard loading={loading} label="Used margin (intraday positions)" value={formatINR(f?.funds.usedMargin)} /></div>
        <div className="col-md-4"><StatCard loading={loading} label="Available margin" value={formatINR(f?.funds.availableMargin)} /></div>
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={() => setMode(mode === 'add' ? null : 'add')}>Add funds</button>
        <button className="btn btn-outline-secondary" onClick={() => setMode(mode === 'withdraw' ? null : 'withdraw')}>Withdraw</button>
      </div>
      {mode && (
        <form className="tx-card tx-card-body d-flex flex-wrap gap-2 align-items-end" onSubmit={submit}>
          <div style={{ minWidth: 220 }}>
            <label className="form-label small">{mode === 'add' ? 'Amount to add (₹)' : 'Amount to withdraw (₹)'}</label>
            <input type="number" min="1" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
          </div>
          {mode === 'add' && [10000, 50000, 100000].map((v) => (
            <button type="button" key={v} className="filter-pill" onClick={() => setAmount(v)}>+{formatINR(v, 0)}</button>
          ))}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Working...' : mode === 'add' ? 'Add funds' : 'Withdraw'}</button>
        </form>
      )}
      <div className="tx-card">
        <div className="tx-card-body border-bottom"><h6 className="fw-bold mb-0">Transaction history</h6></div>
        {txLoading ? <SkeletonRows rows={5} /> : tx?.transactions.length === 0 ? (
          <EmptyState title="No transactions found." text="Buys, sells and fund changes will be listed here." />
        ) : (
          <div className="table-responsive">
            <table className="table tx-table mb-0">
              <thead><tr><th>Date</th><th>Type</th><th>Stock</th><th className="text-end">Qty</th><th className="text-end">Price</th><th className="text-end">Amount</th></tr></thead>
              <tbody>
                {tx.transactions.map((t) => (
                  <tr key={t._id}>
                    <td className="small">{formatDate(t.createdAt)}</td>
                    <td className={`fw-semibold ${TYPE_STYLE[t.type]}`}>{TYPE_LABEL[t.type]}</td>
                    <td>{t.symbol || '-'}</td>
                    <td className="text-end">{t.quantity ?? '-'}</td>
                    <td className="text-end">{t.price ? formatINR(t.price) : '-'}</td>
                    <td className="text-end fw-semibold">{formatINR(t.amount)}</td>
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
