
# E-commerce Backend API

A RESTful E-commerce Backend built using Node.js, Express.js and MongoDB.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Role-Based Access Control (RBAC)

## Features
- User registration and login
- Password hashing using bcrypt
- JWT authentication
- Admin, user and guest roles
- Product CRUD operations
- Product search, filtering and sorting
- User profile management
- Order creation and management
- Order cancellation and stock restoration
- Product recommendation API (local fallback)
- Centralized error handling

## Installation

1. Clone the repository:
   git clone YOUR_GITHUB_REPOSITORY_URL

2. Install dependencies:
   npm install

3. Create a `.env` file in the root folder:

   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d

4. Start the development server:
   npm run dev

## API Routes

| Feature | Endpoint |
|---|---|
| Register | POST /api/auth/register |
| Login | POST /api/auth/login |
| Products | /api/products |
| User Profiles | /api/users |
| Orders | /api/orders |
| Recommendations | GET /api/analytics/recommendations |

## Authentication

Protected routes require a JWT Bearer token.

Admin-only operations require the admin role.

## Project Status

Core backend APIs and authentication are implemented.

Note: The recommendation endpoint currently uses a local fallback. Live RapidMiner integration is not yet configured.
