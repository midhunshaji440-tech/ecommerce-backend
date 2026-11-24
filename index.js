
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/dbConnection.js';
import authenticationRoutes from './routes/authenticationRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import recommendationRoutes from './routes/recommendationRoutes.js';



dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use('/api/auth', authenticationRoutes);
app.use('/api/auth', authenticationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userProfileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});
app.use(errorHandler);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recommendations', recommendationRoutes);

connectDB();

app.get('/', (req, res) => {
    res.send('E-commerce Backend API is Running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
