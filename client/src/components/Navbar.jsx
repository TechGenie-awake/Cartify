import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ cartCount = 0 }) {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🛒 <span>Cart</span>ify
      </Link>

      <div className="navbar-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Shop</Link>
      </div>

      <div className="navbar-right">
        <Link to="/cart" className={`cart-link ${pathname === '/cart' ? 'active' : ''}`}>
          <span className="cart-icon">
            🛍️
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </span>
          Cart
        </Link>
        <Link to="/admin" className={`admin-btn ${pathname === '/admin' ? 'active' : ''}`}>
          Admin
        </Link>
      </div>
    </nav>
  );
}
