import { useState, useEffect } from 'react';
import { productService, cartService } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Clothing', 'Books'];

export default function ProductsPage({ onCartUpdate }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const data = await productService.getAll(params);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addItem(productId);
      showToast('Added to cart!');
      if (onCartUpdate) onCartUpdate();
    } catch {
      showToast('Failed to add to cart');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="shop-page">
      {toast && <div className="toast">{toast}</div>}

      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Give All You Need</h1>
          <div className="hero-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search on Cartify"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>Search</button>
          </div>
        </div>
      </div>

      <div className="shop-body">
        {/* Sidebar */}
        <aside className="sidebar">
          <h4>Category</h4>
          <ul className="category-list">
            {CATEGORIES.map((cat) => (
              <li
                key={cat}
                className={category === cat ? 'active' : ''}
                onClick={() => setCategory(cat)}
              >
                <span className="cat-icon">
                  {cat === 'All' ? '🛍️' : cat === 'Electronics' ? '🎧' : cat === 'Accessories' ? '🎒' : cat === 'Clothing' ? '👕' : '📚'}
                </span>
                {cat === 'All' ? 'All Products' : `For ${cat}`}
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div className="shop-main">
          <div className="shop-header">
            <h2>{category === 'All' ? 'All Products' : category}</h2>
            <span className="product-count">{products.length} items</span>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="cta-banner">
        <div className="cta-left">
          <h2>Ready to Get Our New Stuff?</h2>
          <div className="cta-form">
            <input type="email" placeholder="Your Email" />
            <button>Send</button>
          </div>
        </div>
        <div className="cta-right">
          <strong>Cartify for Everyone</strong>
          <p>Browse our curated collection of products across categories — quality you can trust, prices you'll love.</p>
        </div>
      </div>
    </div>
  );
}
