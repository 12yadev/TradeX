import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Logo from './Logo';

const LINKS = [['/#home', 'Home'], ['/#products', 'Products'], ['/#pricing', 'Pricing'], ['/#about', 'About']];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-white border-bottom sticky-top position-relative" style={{ zIndex: 1030 }}>
      <div className="container d-flex align-items-center justify-content-between py-2">
        <Logo />
        <div className={`${open ? 'd-flex' : 'd-none'} d-md-flex flex-column flex-md-row gap-2 gap-md-3 align-items-md-center position-absolute position-md-static bg-white start-0 end-0 p-3 p-md-0 border-bottom border-md-0`} style={{ top: 58 }}>
          {LINKS.map(([href, label]) => (
            <a key={label} href={href} className="text-secondary fw-medium" onClick={() => setOpen(false)}>{label}</a>
          ))}
          <Link to="/login" className="btn btn-outline-primary btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
        </div>
        <button className="btn btn-light d-md-none" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <FiX /> : <FiMenu />}</button>
      </div>
    </nav>
  );
}
