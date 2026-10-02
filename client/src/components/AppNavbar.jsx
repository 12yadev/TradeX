import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Logo from './Logo';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';

const TOP_LINKS = [
  ['/dashboard', 'Dashboard'], ['/orders', 'Orders'], ['/holdings', 'Holdings'],
  ['/positions', 'Positions'], ['/funds', 'Funds'], ['/profile', 'Profile'],
];

export default function AppNavbar({ onMenu }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <button className="btn btn-light d-lg-none" onClick={onMenu} aria-label="Open menu"><FiMenu /></button>
      <Logo to="/dashboard" />
      <nav className="d-none d-xl-flex gap-1 ms-2">
        {TOP_LINKS.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `top-link ${isActive ? 'active' : ''}`}>{label}</NavLink>
        ))}
      </nav>
      <div className="ms-auto d-flex align-items-center gap-3 flex-grow-1 justify-content-end">
        <SearchBar />
        <span className="small text-muted d-none d-md-inline">{user?.name}</span>
        <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
          <FiLogOut /> <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
