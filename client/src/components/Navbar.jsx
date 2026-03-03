import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ cartCount = 0 }) {
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Cartify</Link>
      <div className="navbar-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Products</Link>
        <Link to="/admin" className={pathname === '/admin' ? 'active' : ''}>Admin</Link>
        <Link to="/cart" className={`cart-link ${pathname === '/cart' ? 'active' : ''}`}>
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}
