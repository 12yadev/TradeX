import { NavLink } from 'react-router-dom';
import { FiHome, FiStar, FiClipboard, FiBriefcase, FiLayers, FiPieChart, FiCreditCard, FiUser } from 'react-icons/fi';

export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/watchlist', label: 'Watchlist', icon: FiStar },
  { to: '/orders', label: 'Orders', icon: FiClipboard },
  { to: '/holdings', label: 'Holdings', icon: FiBriefcase },
  { to: '/positions', label: 'Positions', icon: FiLayers },
  { to: '/portfolio', label: 'Portfolio', icon: FiPieChart },
  { to: '/funds', label: 'Funds', icon: FiCreditCard },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

// Fixed on desktop, slides in as a drawer on mobile
export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <p className="text-muted mt-4 px-2" style={{ fontSize: '0.7rem' }}>
          Paper trading only. Prices are simulated and not real-time.
        </p>
      </aside>
    </>
  );
}
