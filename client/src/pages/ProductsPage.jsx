import { useState, useEffect, useCallback } from 'react';
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

  const loadProducts = useCallback(async () => {
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
  }, [search, category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
        <img src="/herosection.jpg" alt="hero" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-big-text">Shop</div>
      </div>

      {/* Search bar */}
      <div className="search-section-outer">
        <div className="search-section">
          <h2>Give All You Need</h2>
          <div className="hero-search">
            <span className="search-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
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

      <div className="shop-body-outer"><div className="shop-body">
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
                  {cat === 'All' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>}
                  {cat === 'Electronics' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
                  {cat === 'Accessories' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>}
                  {cat === 'Clothing' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>}
                  {cat === 'Books' && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>}
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
      </div></div>

    </div>
  );
}
