const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create initial cart
  const cart = await prisma.cart.create({
    data: {},
  });

  console.log('Cart created:', cart);

  // Create sample products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
      stock: 50,
    },
    {
      name: 'Smart Watch',
      description: 'Feature-packed smartwatch with fitness tracking, heart rate monitor, and GPS',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      category: 'Electronics',
      stock: 30,
    },
    {
      name: 'Laptop Backpack',
      description: 'Durable laptop backpack with multiple compartments and USB charging port',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      category: 'Accessories',
      stock: 75,
    },
    {
      name: 'Mechanical Keyboard',
      description: 'RGB mechanical gaming keyboard with blue switches and aluminum frame',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      category: 'Electronics',
      stock: 40,
    },
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with adjustable DPI and rechargeable battery',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      category: 'Electronics',
      stock: 60,
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
      category: 'Accessories',
      stock: 100,
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log('Created product:', createdProduct.name);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
