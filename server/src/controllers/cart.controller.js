const prisma = require('../config/db');

const CART_ID = 1;

const ensureCart = async () => {
  let cart = await prisma.cart.findUnique({ where: { id: CART_ID } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { id: CART_ID } });
  }
  return cart;
};

const getCart = async (req, res) => {
  try {
    await ensureCart();
    const cart = await prisma.cart.findUnique({
      where: { id: CART_ID },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    await ensureCart();
    const { productId, quantity = 1 } = req.body;

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: CART_ID, productId: parseInt(productId) } },
    });

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parseInt(quantity) },
        include: { product: true },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: CART_ID, productId: parseInt(productId), quantity: parseInt(quantity) },
        include: { product: true },
      });
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (parseInt(quantity) <= 0) {
      await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
      return res.json({ message: 'Item removed' });
    }
    const item = await prisma.cartItem.update({
      where: { id: parseInt(req.params.id) },
      data: { quantity: parseInt(quantity) },
      include: { product: true },
    });
    res.json(item);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Cart item not found' });
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Cart item not found' });
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
