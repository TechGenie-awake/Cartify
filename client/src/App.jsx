import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import { cartService } from './services/api';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const cart = await cartService.getCart();
      const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    cartService.getCart()
      .then((cart) => {
        const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  }, []);

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<ProductsPage onCartUpdate={refreshCartCount} />} />
            <Route path="/products/:id" element={<ProductDetailPage onCartUpdate={refreshCartCount} />} />
            <Route path="/cart" element={<CartPage onCartUpdate={refreshCartCount} />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
