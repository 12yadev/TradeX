import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Sidebar from '../components/Sidebar';
import { TradeProvider } from '../context/TradeContext';

// Layout for every logged-in page: top bar + sidebar + page content
export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <TradeProvider>
      <AppNavbar onMenu={() => setMenuOpen(true)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="app-main"><Outlet /></main>
    </TradeProvider>
  );
}
