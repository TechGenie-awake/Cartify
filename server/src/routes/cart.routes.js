const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cart.controller');
const { validateCartItem } = require('../middleware/validate');

router.get('/', getCart);
router.post('/', validateCartItem, addToCart);
router.put('/:id', updateCartItem);
router.delete('/', clearCart);
router.delete('/:id', removeFromCart);

module.exports = router;
