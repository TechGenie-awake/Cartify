import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, cartService } from '../services/api';
import './ProductDetailPage.css';

const getrating = (id) => (3.8 + (id % 12) * 0.1).toFixed(1);
const getReviews = (id) => `${((id * 137) % 900 + 100)}`;

export default function ProductDetailPage({ onCartUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    productService.getById(id)
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await cartService.addItem(product.id, quantity);
      setToast('Added to cart!');
      setTimeout(() => setToast(''), 2000);
      if (onCartUpdate) onCartUpdate();
    } catch {
      setToast('Failed to add to cart');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  const rating = getrating(product.id);
  const reviews = getReviews(product.id);

  return (
    <div className="detail-page">
      {toast && <div className="toast">{toast}</div>}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to products</button>
      <div className="detail-container">
        <div className="detail-img-wrap">
          <img src={product.image} alt={product.name} className="detail-img" />
        </div>
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-rating">
            <span className="stars">★</span>
            <span className="rating-val">{rating}</span>
            <span className="rating-count">({reviews} Reviews)</span>
          </div>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <p className="detail-stock">
            {product.stock > 0
              ? <span className="in-stock">✓ {product.stock} units in stock</span>
              : <span className="out-stock">✗ Out of stock</span>}
          </p>
          <span className="quantity-label">Quantity</span>
          <div className="quantity-row">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <div className="detail-actions">
            <button
              className="btn-add-detail"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button className="btn-wishlist">♡</button>
          </div>
        </div>
      </div>
    </div>
  );
}
