// Reusable loading UI: spinner, full-page loader, skeleton blocks and table skeleton
export function Spinner({ text = 'Loading...', small = false }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 text-muted py-4">
      <div className={`spinner-border text-primary ${small ? 'spinner-border-sm' : ''}`} role="status" />
      <span>{text}</span>
    </div>
  );
}

export const PageLoader = ({ text = 'Loading...' }) => (
  <div style={{ minHeight: '50vh' }} className="d-flex align-items-center justify-content-center">
    <Spinner text={text} />
  </div>
);

export const Skeleton = ({ height = 16, width = '100%', className = '' }) => (
  <div className={`skeleton ${className}`} style={{ height, width }} />
);

export const SkeletonCard = ({ height = 90 }) => (
  <div className="tx-card tx-card-body"><Skeleton height={12} width="40%" className="mb-3" /><Skeleton height={height - 40} width="70%" /></div>
);

export const SkeletonRows = ({ rows = 5 }) => (
  <div className="p-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} height={22} className="mb-3" />
    ))}
  </div>
);

export const ErrorBox = ({ message, onRetry }) => (
  <div className="alert alert-danger d-flex justify-content-between align-items-center">
    <span>{message}</span>
    {onRetry && <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>Try again</button>}
  </div>
);
