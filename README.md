# E-Commerce Backend API

A RESTful E-Commerce Backend built using Node.js, Express.js, and MongoDB. This project provides secure authentication, role-based access control, product management, order processing, analytics, and personalized product recommendations.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs
- Role-Based Access Control (RBAC)
- Altair AI Studio (RapidMiner)

## Features

- User registration and login
- Password hashing using bcryptjs
- JWT authentication
- Role-based access control
- Admin-only product management
- Product CRUD operations
- Product search, filtering, and sorting
- User profile management
- Order creation and management
- Order cancellation and stock restoration
- Analytics API
- Personalized product recommendation API
- Centralized error handling
- MongoDB Atlas integration
- Render deployment

## Recommendation System

The recommendation system was developed using Altair AI Studio.

A sample product interaction dataset was used to build a Decision Tree classification model and a recommendation scoring workflow.

The recommendation workflow calculates scores using:
- Product views
- Cart additions
- Product ratings
- Previous purchases

The generated recommendation results are exported to a CSV file and served through the backend API.

## Installation

1. Clone the repository:

   `git clone YOUR_GITHUB_REPOSITORY_URL`

2. Navigate to the project directory:

   `cd ecommerce-backend`

3. Install dependencies:

   `npm install`

4. Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1d
   ```

5. Start the development server:

   `npm run dev`

## API Routes

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| View Products | GET | `/api/products` |
| View Product | GET | `/api/products/:id` |
| Create Product | POST | `/api/products` |
| Update Product | PUT | `/api/products/:id` |
| Delete Product | DELETE | `/api/products/:id` |
| User Profiles | GET/PUT | `/api/users` |
| Orders | GET/POST | `/api/orders` |
| Recommendations | GET | `/api/recommendations` |
| Analytics | GET | `/api/analytics` |

*Some routes may have additional parameters or authorization requirements.*

## Authentication

Protected routes require a JWT Bearer token.

Authorization is implemented using role-based access control:

- Admin: Authorized administrative operations.
- User: Authenticated user operations.
- Guest: Public access to available resources.

## Deployment

**Platform:** Render

**Live API:** https://ecommerce-backend-7177.onrender.com

## Testing

API endpoints were tested using Postman.

Testing included:
- User registration and login
- JWT authentication
- Unauthorized access handling
- Role-based authorization
- Product CRUD operations
- Product search and filtering
- Product sorting
- Order management
- Personalized recommendations

## Project Status

Core backend functionality, recommendation workflow, and deployment have been implemented.