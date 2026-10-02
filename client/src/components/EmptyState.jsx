import { Link } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title, text, actionLabel, to, onAction, icon: Icon = FiInbox }) {
  return (
    <div className="text-center py-5 px-3">
      <Icon size={40} className="text-muted mb-3" />
      <h6 className="fw-semibold mb-1">{title}</h6>
      {text && <p className="text-muted small mb-3">{text}</p>}
      {actionLabel && to && <Link to={to} className="btn btn-primary btn-sm">{actionLabel}</Link>}
      {actionLabel && onAction && <button className="btn btn-primary btn-sm" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
