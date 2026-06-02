# Eco Pet Shop - MERN Stack E-commerce Application

A full-featured e-commerce application for eco-friendly pet products built with MongoDB, Express, React, and Node.js.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Product Management**: CRUD operations for products with categories and filters
- **Shopping Cart**: Add/remove items, update quantities
- **Order System**: Checkout process with shipping and payment options
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Eco-Friendly Focus**: Special highlighting for sustainable products

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled
- Error handling middleware

### Frontend
- React with Vite
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management
- Axios for API calls
- React Icons for UI elements

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eco-pet-shop
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Running the Application

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### Available Scripts

**Backend:**
- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm run seed`: Seed database with sample data
- `npm run seed-destroy`: Clear database

**Frontend:**
- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### Products
- `GET /api/v1/products` - Get all products (with filters)
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Cart
- `GET /api/v1/cart` - Get user's cart (protected)
- `POST /api/v1/cart` - Add item to cart (protected)
- `PUT /api/v1/cart/:itemId` - Update cart item (protected)
- `DELETE /api/v1/cart/:itemId` - Remove item from cart (protected)
- `DELETE /api/v1/cart` - Clear cart (protected)

### Orders
- `POST /api/v1/orders` - Create order (protected)
- `GET /api/v1/orders` - Get user's orders (protected)
- `GET /api/v1/orders/:id` - Get single order (protected)
- `PUT /api/v1/orders/:id/status` - Update order status (admin)
- `PUT /api/v1/orders/:id/payment` - Update payment status (admin)

## Demo Credentials

- **Admin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `password123`

## Project Structure

```
eco-pet-shop/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Environment Variables

Create a `.env` file in the backend directory:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/eco-pet-shop
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

## License

This project is open source and available under the ISC License.