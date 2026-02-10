# 🛒 Cartify - E-Commerce Web Application

Cartify is a full-stack e-commerce web application designed to provide a smooth and modern online shopping experience. The platform allows users to browse products, view detailed product information, add items to the cart, and manage products through a complete CRUD-based backend system.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-vercel-url.vercel.app)
[![Backend](https://img.shields.io/badge/backend-render-blue)](https://your-render-url.onrender.com)

## 🌟 Features

- **Product Catalog**: Browse through a comprehensive list of products
- **Product Details**: View detailed information about each product
- **Shopping Cart**: Add, update, and remove items from cart
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for products
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **RESTful API**: Clean and well-structured API endpoints
- **Database Integration**: SQLite3 with Prisma ORM for efficient data management

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building interactive interfaces
- **Axios** - HTTP client for API requests
- **React Router** - Navigation and routing
- **CSS3/Tailwind** - Styling and responsive design
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Prisma** - Next-generation ORM
- **SQLite3** - Lightweight database (development)
- **CORS** - Cross-Origin Resource Sharing middleware

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cartify.git
cd cartify
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database with sample data
npx prisma db seed

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

#### Frontend Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get all cart items |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |

### Example Request Bodies

**Create Product (POST /api/products)**
```json
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 99.99,
  "image": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 50
}
```

**Add to Cart (POST /api/cart)**
```json
{
  "productId": 1,
  "quantity": 2
}
```

## 🗄️ Database Schema

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  image       String
  category    String
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  cartItems   CartItem[]
}

model Cart {
  id        Int        @id @default(autoincrement())
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  items     CartItem[]
}

model CartItem {
  id        Int      @id @default(autoincrement())
  cartId    Int
  productId Int
  quantity  Int
  cart      Cart     @relation(fields: [cartId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId])
}
```
