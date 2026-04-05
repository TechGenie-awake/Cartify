import { Link } from 'react-router-dom';
import './ProductCard.css';

const getrating = (id) => (3.8 + (id % 12) * 0.1).toFixed(1);
const getReviews = (id) => `${((id * 137) % 900 + 100)}`;

export default function ProductCard({ product, onAddToCart }) {
  const rating = getrating(product.id);
  const reviews = getReviews(product.id);

  return (
    <div className="product-card">
      <div className="card-badge">{product.category}</div>
      <Link to={`/products/${product.id}`} className="card-img-wrap">
        <img src={product.image} alt={product.name} className="card-img" />
      </Link>
      <div className="card-body">
        <div className="card-rating">
          <span className="stars">★</span>
          <span className="rating-val">{rating}</span>
          <span className="rating-count">({reviews} Reviews)</span>
        </div>
        <Link to={`/products/${product.id}`}>
          <h3 className="card-name">{product.name}</h3>
        </Link>
        <p className="card-price">${product.price.toFixed(2)}</p>
        <div className="card-actions">
          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(product.id)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
          <Link to={`/products/${product.id}`} className="btn-buy-now">
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}
