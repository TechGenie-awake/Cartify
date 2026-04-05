import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import './AdminPage.css';

const emptyForm = { name: '', description: '', price: '', image: '', category: '', stock: '' };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await productService.update(editId, form);
        showToast('Product updated');
      } else {
        await productService.create(form);
        showToast('Product created');
      }
      setForm(emptyForm);
      setEditId(null);
      await loadProducts();
    } catch {
      showToast('Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await productService.delete(id);
      showToast('Product deleted');
      await loadProducts();
    } catch {
      showToast('Delete failed');
    }
  };

  return (
    <div className="admin-page">
      {toast && <div className="toast">{toast}</div>}
      <h1>Admin — Product Management</h1>

      <form className="product-form" onSubmit={handleSubmit}>
        <h2>{editId ? 'Edit Product' : 'Add New Product'}</h2>
        <div className="form-grid">
          {['name', 'category'].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
            />
          ))}
          <input
            type="url"
            placeholder="Image URL (e.g. https://images.unsplash.com/...)"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
            style={{ gridColumn: '1 / -1' }}
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            min="0"
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            min="0"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-save">{editId ? 'Update' : 'Create'}</button>
          {editId && (
            <button type="button" className="btn-cancel" onClick={() => { setEditId(null); setForm(emptyForm); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-wrap">
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn-del" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
