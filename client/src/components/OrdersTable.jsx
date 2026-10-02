import { formatINR, formatDate, shortOrderId, productLabel } from '../utils/format';

export const STATUS_STYLE = {
  COMPLETED: 'bg-success-subtle text-success-emphasis',
  PENDING: 'bg-warning-subtle text-warning-emphasis',
  CANCELLED: 'bg-secondary-subtle text-secondary-emphasis',
  REJECTED: 'bg-danger-subtle text-danger-emphasis',
};

// Orders table. Pass onCancel to show a Cancel button for pending orders.
export default function OrdersTable({ orders, onCancel }) {
  return (
    <div className="table-responsive">
      <table className="table tx-table mb-0">
        <thead>
          <tr><th>Order ID</th><th>Stock</th><th>Type</th><th className="text-end">Qty</th><th className="text-end">Price</th><th>Order type</th><th>Status</th><th>Date</th><th className="text-end">Total</th>{onCancel && <th />}</tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id}>
              <td className="text-muted small">#{shortOrderId(o._id)}</td>
              <td><strong>{o.symbol}</strong> <span className="small text-muted">{productLabel(o.product)}</span></td>
              <td><span className={`fw-semibold ${o.transactionType === 'BUY' ? 'text-primary' : 'text-loss'}`}>{o.transactionType}</span></td>
              <td className="text-end">{o.quantity}</td>
              <td className="text-end">{formatINR(o.price)}</td>
              <td>{o.orderType}</td>
              <td><span className={`badge ${STATUS_STYLE[o.status]}`}>{o.status.charAt(0) + o.status.slice(1).toLowerCase()}</span></td>
              <td className="small">{formatDate(o.createdAt)}</td>
              <td className="text-end fw-semibold">{formatINR(o.totalAmount)}</td>
              {onCancel && <td>{o.status === 'PENDING' && <button className="btn btn-outline-danger btn-xs" onClick={() => onCancel(o)}>Cancel</button>}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
