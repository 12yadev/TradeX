import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getStock, getFunds, placeOrder } from '../services/tradingService';
import { getErrorMessage } from '../services/api';
import { formatINR } from '../utils/format';
import { Spinner } from './Loaders';

// Buy / Sell order form (simulated). Quantity x Price = Total.
export default function TradeModal({ trade, onClose, onSuccess }) {
  const { symbol, side } = trade;
  const isBuy = side === 'BUY';
  const [stock, setStock] = useState(null);
  const [funds, setFunds] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('MARKET');
  const [product, setProduct] = useState(trade.product || 'LONGTERM');
  const [limitPrice, setLimitPrice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([getStock(symbol), getFunds()])
      .then(([s, f]) => { setStock(s.stock); setFunds(f.funds); setLimitPrice(s.stock.currentPrice); })
      .catch((err) => setLoadError(getErrorMessage(err)));
  }, [symbol]);

  const price = orderType === 'MARKET' ? stock?.currentPrice : Number(limitPrice);
  const qty = Number(quantity);
  const total = (price || 0) * (qty || 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!Number.isInteger(qty) || qty < 1) return toast.error('Quantity must be a whole number of at least 1.');
    if (orderType === 'LIMIT' && !(price > 0)) return toast.error('Enter a valid limit price.');
    if (isBuy && funds && total > funds.balance) return toast.error('Insufficient funds.');
    setBusy(true);
    try {
      const res = await placeOrder({ symbol, transactionType: side, quantity: qty, orderType, product, price: orderType === 'LIMIT' ? price : undefined });
      toast.success(res.message);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tx-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="tx-modal" onSubmit={submit}>
        <div className={`tx-modal-head ${isBuy ? 'buy' : 'sell'}`}>
          <div className="fw-bold fs-5">{isBuy ? 'Buy' : 'Sell'} {symbol}</div>
          <div className="small opacity-75">{stock?.companyName || 'Loading...'} · Simulated order</div>
        </div>
        <div className="p-3 p-md-4">
          {loadError && <div className="alert alert-danger">{loadError}</div>}
          {!stock && !loadError && <Spinner />}
          {stock && (
            <>
              <div className="d-flex justify-content-between small mb-3">
                <span className="text-muted">Current price (simulated)</span>
                <strong>{formatINR(stock.currentPrice)}</strong>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small">Quantity</label>
                  <input type="number" min="1" step="1" className="form-control" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label small">Product</label>
                  <select className="form-select" value={product} onChange={(e) => setProduct(e.target.value)}>
                    <option value="LONGTERM">Long-term</option>
                    <option value="INTRADAY">Intraday</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small">Order type</label>
                  <select className="form-select" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                    <option value="MARKET">Market</option>
                    <option value="LIMIT">Limit</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small">Price (₹)</label>
                  <input
                    type="number" step="0.05" min="0.05" className="form-control"
                    disabled={orderType === 'MARKET'}
                    value={orderType === 'MARKET' ? stock.currentPrice : limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="total-box mt-3">
                <div className="small text-muted">Quantity × Price = Total</div>
                <div className="fw-bold">{qty || 0} × {formatINR(price || 0)} = <span className="fs-5">{formatINR(total)}</span></div>
              </div>
              {isBuy && funds && (
                <div className="small text-muted mt-2">Available funds: {formatINR(funds.balance)}</div>
              )}
              {orderType === 'LIMIT' && (
                <div className="small text-muted mt-2">A limit order waits as Pending until the simulated price reaches your price.</div>
              )}
            </>
          )}
        </div>
        <div className="d-flex gap-2 justify-content-end p-3 pt-0 p-md-4 pt-md-0">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className={`btn ${isBuy ? 'btn-buy' : 'btn-sell'}`} disabled={!stock || busy}>
            {busy ? 'Placing...' : isBuy ? 'Buy' : 'Sell'}
          </button>
        </div>
      </form>
    </div>
  );
}
