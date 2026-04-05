const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Idempotent: ensure cart exists
  await prisma.cart.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  const products = [
    // Electronics
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
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with 360-degree sound and 12-hour battery',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      category: 'Electronics',
      stock: 45,
    },
    // Accessories
    {
      name: 'Laptop Backpack',
      description: 'Durable laptop backpack with multiple compartments and USB charging port',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      category: 'Accessories',
      stock: 75,
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
      category: 'Accessories',
      stock: 100,
    },
    {
      name: 'Phone Stand',
      description: 'Adjustable aluminum phone and tablet stand for desk use',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=500',
      category: 'Accessories',
      stock: 80,
    },
    {
      name: 'Leather Wallet',
      description: 'Slim genuine leather bifold wallet with RFID blocking technology',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      category: 'Accessories',
      stock: 55,
    },
    // Clothing
    {
      name: 'Classic White T-Shirt',
      description: 'Premium 100% cotton crew neck t-shirt, comfortable everyday essential',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      category: 'Clothing',
      stock: 120,
    },
    {
      name: 'Slim Fit Jeans',
      description: 'Modern slim fit denim jeans with stretch fabric for all-day comfort',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      category: 'Clothing',
      stock: 85,
    },
    {
      name: 'Hoodie Sweatshirt',
      description: 'Soft fleece pullover hoodie with kangaroo pocket, perfect for cool days',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
      category: 'Clothing',
      stock: 70,
    },
    {
      name: 'Running Sneakers',
      description: 'Lightweight breathable running shoes with cushioned sole and arch support',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      category: 'Clothing',
      stock: 50,
    },
    // Books
    {
      name: 'Clean Code',
      description: 'A handbook of agile software craftsmanship by Robert C. Martin',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500',
      category: 'Books',
      stock: 40,
    },
    {
      name: 'The Pragmatic Programmer',
      description: 'Your journey to mastery — timeless lessons for software developers',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
      category: 'Books',
      stock: 35,
    },
    {
      name: 'Atomic Habits',
      description: 'An easy and proven way to build good habits and break bad ones',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
      category: 'Books',
      stock: 60,
    },
    {
      name: 'Deep Work',
      description: 'Rules for focused success in a distracted world by Cal Newport',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      category: 'Books',
      stock: 45,
    },
  ];

  // Idempotent: clear and re-seed products
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });

  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
