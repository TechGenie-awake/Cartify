import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../services/api';
import './CartPage.css';

export default function CartPage({ onCartUpdate }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await cartService.updateItem(itemId, quantity);
      await loadCart();
      if (onCartUpdate) onCartUpdate();
    } catch {
      // ignore
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await loadCart();
      if (onCartUpdate) onCartUpdate();
    } catch {
      // ignore
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      await loadCart();
      if (onCartUpdate) onCartUpdate();
    } catch {
      // ignore
    }
  };

  if (loading) return <div className="cart-loading">Loading cart...</div>;

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-shop">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.product.image} alt={item.product.name} />
                <div className="item-details">
                  <Link to={`/products/${item.product.id}`}>
                    <h3>{item.product.name}</h3>
                  </Link>
                  <p className="item-price">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="item-controls">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
                <p className="item-subtotal">${(item.product.price * item.quantity).toFixed(2)}</p>
                <button className="remove-btn" onClick={() => handleRemove(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({items.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn-checkout">Checkout</button>
            <button className="btn-clear-cart" onClick={handleClearCart}>Clear Cart</button>
            <Link to="/" className="continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      )}
    </div>
  );
}
