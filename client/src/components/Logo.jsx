import { Link } from 'react-router-dom';

export default function Logo({ to = '/', light = false }) {
  return (
    <Link to={to} className="tx-logo" style={light ? { color: '#fff' } : undefined}>
      <span className="tx-logo-mark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-6 4 4 8-9" />
        </svg>
      </span>
      <span>Trade<span className="x">X</span></span>
    </Link>
  );
}
