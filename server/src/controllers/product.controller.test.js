const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('./product.controller');

jest.mock('../config/db', () => ({
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require('../config/db');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Product Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getAllProducts', () => {
    it('returns all products', async () => {
      const products = [{ id: 1, name: 'Headphones', price: 99.99 }];
      prisma.product.findMany.mockResolvedValue(products);
      const req = { query: {} };
      const res = mockRes();
      await getAllProducts(req, res);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('handles errors', async () => {
      prisma.product.findMany.mockRejectedValue(new Error('DB error'));
      const req = { query: {} };
      const res = mockRes();
      await getAllProducts(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProductById', () => {
    it('returns a product by id', async () => {
      const product = { id: 1, name: 'Headphones' };
      prisma.product.findUnique.mockResolvedValue(product);
      const req = { params: { id: '1' } };
      const res = mockRes();
      await getProductById(req, res);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('returns 404 if not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);
      const req = { params: { id: '999' } };
      const res = mockRes();
      await getProductById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createProduct', () => {
    it('creates a product and returns 201', async () => {
      const product = { id: 1, name: 'Watch', price: 249.99 };
      prisma.product.create.mockResolvedValue(product);
      const req = { body: { name: 'Watch', description: 'Smart watch', price: '249.99', image: 'img.jpg', category: 'Electronics', stock: '30' } };
      const res = mockRes();
      await createProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(product);
    });
  });

  describe('updateProduct', () => {
    it('updates and returns product', async () => {
      const updated = { id: 1, name: 'Updated Watch' };
      prisma.product.update.mockResolvedValue(updated);
      const req = { params: { id: '1' }, body: { name: 'Updated Watch', description: 'Desc', price: '200', image: 'img.jpg', category: 'Electronics', stock: '20' } };
      const res = mockRes();
      await updateProduct(req, res);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('returns 404 if not found', async () => {
      const err = new Error('Not found');
      err.code = 'P2025';
      prisma.product.update.mockRejectedValue(err);
      const req = { params: { id: '999' }, body: { name: 'x', description: 'x', price: '1', image: 'x', category: 'x', stock: '1' } };
      const res = mockRes();
      await updateProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteProduct', () => {
    it('deletes product and returns message', async () => {
      prisma.product.delete.mockResolvedValue({});
      const req = { params: { id: '1' } };
      const res = mockRes();
      await deleteProduct(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted' });
    });
  });
});
