const request = require('supertest');
const app = require('./app');

jest.mock('./config/db', () => ({
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require('./config/db');

describe('API Integration Tests', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /health', () => {
    it('returns 200 ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /api/products', () => {
    it('returns products array', async () => {
      const products = [
        { id: 1, name: 'Headphones', price: 99.99, category: 'Electronics', stock: 50 },
      ];
      prisma.product.findMany.mockResolvedValue(products);
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(products);
    });
  });

  describe('GET /api/products/:id', () => {
    it('returns 404 for missing product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      const res = await request(app).get('/api/products/999');
      expect(res.status).toBe(404);
    });

    it('returns the product', async () => {
      const product = { id: 1, name: 'Headphones', price: 99.99 };
      prisma.product.findUnique.mockResolvedValue(product);
      const res = await request(app).get('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Headphones');
    });
  });

  describe('POST /api/products', () => {
    it('creates a product', async () => {
      const product = { id: 1, name: 'Watch', price: 249.99 };
      prisma.product.create.mockResolvedValue(product);
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Watch', description: 'Smart watch', price: 249.99, image: 'img.jpg', category: 'Electronics', stock: 30 });
      expect(res.status).toBe(201);
    });
  });

  describe('GET /api/cart', () => {
    it('returns cart', async () => {
      const cart = { id: 1, items: [] };
      prisma.cart.findUnique.mockResolvedValue(cart);
      const res = await request(app).get('/api/cart');
      expect(res.status).toBe(200);
      expect(res.body.items).toEqual([]);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('deletes a product', async () => {
      prisma.product.delete.mockResolvedValue({});
      const res = await request(app).delete('/api/products/1');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product deleted');
    });
  });
});
