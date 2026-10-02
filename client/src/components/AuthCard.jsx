import Logo from './Logo';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-wrap">
      <div className="tx-card tx-card-body w-100" style={{ maxWidth: 440, padding: '2rem' }}>
        <div className="text-center mb-4">
          <Logo />
          <h4 className="fw-bold mt-3 mb-1">{title}</h4>
          <p className="text-muted small mb-0">{subtitle}</p>
        </div>
        {children}
        <div className="text-center small mt-4">{footer}</div>
        <p className="text-center text-muted mt-3 mb-0" style={{ fontSize: '0.72rem' }}>
          TradeX is an educational paper-trading project and does not execute real stock-market transactions.
        </p>
      </div>
    </div>
  );
}
