import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService, cartService } from '../services/api';
import './ProductDetailPage.css';

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
  }, [id]);

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

  return (
    <div className="detail-page">
      {toast && <div className="toast">{toast}</div>}
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="detail-container">
        <img src={product.image} alt={product.name} className="detail-img" />
        <div className="detail-info">
          <span className="detail-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-description">{product.description}</p>
          <p className="detail-stock">
            {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
          </p>
          <div className="quantity-row">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <button
            className="btn-add-detail"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
