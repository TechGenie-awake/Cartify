import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import { cartService } from './services/api';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    refreshCartCount();
  }, []);

  const refreshCartCount = async () => {
    try {
      const cart = await cartService.getCart();
      const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage onCartUpdate={refreshCartCount} />} />
          <Route path="/products/:id" element={<ProductDetailPage onCartUpdate={refreshCartCount} />} />
          <Route path="/cart" element={<CartPage onCartUpdate={refreshCartCount} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
