import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer py-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <Logo light />
            <p className="small mt-3 mb-0">An original, educational paper-trading project. Practice trading with virtual money and simulated prices.</p>
          </div>
          <div className="col-6 col-md-3">
            <h6 className="text-white">Explore</h6>
            <ul className="list-unstyled small">
              <li><a href="/#products">Products</a></li><li><a href="/#pricing">Pricing</a></li><li><a href="/#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="text-white">Account</h6>
            <ul className="list-unstyled small">
              <li><a href="/login">Login</a></li><li><a href="/register">Sign Up</a></li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="small mb-0">
          TradeX is an educational paper-trading project and does not execute real stock-market transactions. Market data shown is mock/simulated and is not real-time. © {new Date().getFullYear()} TradeX.
        </p>
      </div>
    </footer>
  );
}
