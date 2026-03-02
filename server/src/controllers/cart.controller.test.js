const { getCart, addToCart, updateCartItem, removeFromCart } = require('./cart.controller');

jest.mock('../config/db', () => ({
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

const prisma = require('../config/db');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Cart Controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getCart', () => {
    it('returns cart with items', async () => {
      const cart = { id: 1, items: [] };
      prisma.cart.findUnique.mockResolvedValue(cart);
      const req = {};
      const res = mockRes();
      await getCart(req, res);
      expect(res.json).toHaveBeenCalledWith(cart);
    });
  });

  describe('addToCart', () => {
    it('adds new item to cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1 });
      prisma.cartItem.findUnique.mockResolvedValue(null);
      const newItem = { id: 1, cartId: 1, productId: 2, quantity: 1, product: { name: 'Watch' } };
      prisma.cartItem.create.mockResolvedValue(newItem);
      const req = { body: { productId: 2, quantity: 1 } };
      const res = mockRes();
      await addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newItem);
    });

    it('increments quantity if item already in cart', async () => {
      prisma.cart.findUnique.mockResolvedValue({ id: 1 });
      const existing = { id: 5, cartId: 1, productId: 2, quantity: 2 };
      prisma.cartItem.findUnique.mockResolvedValue(existing);
      const updated = { ...existing, quantity: 3, product: { name: 'Watch' } };
      prisma.cartItem.update.mockResolvedValue(updated);
      const req = { body: { productId: 2, quantity: 1 } };
      const res = mockRes();
      await addToCart(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateCartItem', () => {
    it('removes item if quantity <= 0', async () => {
      prisma.cartItem.delete.mockResolvedValue({});
      const req = { params: { id: '1' }, body: { quantity: 0 } };
      const res = mockRes();
      await updateCartItem(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item removed' });
    });

    it('updates item quantity', async () => {
      const item = { id: 1, quantity: 3, product: { name: 'Watch' } };
      prisma.cartItem.update.mockResolvedValue(item);
      const req = { params: { id: '1' }, body: { quantity: 3 } };
      const res = mockRes();
      await updateCartItem(req, res);
      expect(res.json).toHaveBeenCalledWith(item);
    });
  });

  describe('removeFromCart', () => {
    it('removes item from cart', async () => {
      prisma.cartItem.delete.mockResolvedValue({});
      const req = { params: { id: '1' } };
      const res = mockRes();
      await removeFromCart(req, res);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item removed from cart' });
    });
  });
});
