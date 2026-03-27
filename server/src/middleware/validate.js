const validateProduct = (req, res, next) => {
  const { name, description, price, image, category, stock } = req.body;
  const errors = [];

  if (!name || name.trim() === '') errors.push('name is required');
  if (!description || description.trim() === '') errors.push('description is required');
  if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) < 0)
    errors.push('price must be a non-negative number');
  if (!image || image.trim() === '') errors.push('image is required');
  if (!category || category.trim() === '') errors.push('category is required');
  if (stock === undefined || isNaN(parseInt(stock)) || parseInt(stock) < 0)
    errors.push('stock must be a non-negative integer');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

const validateCartItem = (req, res, next) => {
  const { productId, quantity } = req.body;
  const errors = [];

  if (!productId || isNaN(parseInt(productId))) errors.push('productId must be a valid number');
  if (quantity !== undefined && (isNaN(parseInt(quantity)) || parseInt(quantity) < 1))
    errors.push('quantity must be a positive integer');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = { validateProduct, validateCartItem };
