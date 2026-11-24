
import Order from '../models/order.js';
import Product from '../models/product.js';

export const getRecommendations = async (req, res) => {
    try {
        // Get the user's previous orders
        const orders = await Order.find({
            user: req.user.id
        }).populate('products.product');

        // Collect categories of previously purchased products
        const purchasedCategories = [];

        orders.forEach(order => {
            order.products.forEach(item => {
                if (item.product?.category) {
                    purchasedCategories.push(item.product.category);
                }
            });
        });

        // Find products in similar categories
        let recommendations = [];

        if (purchasedCategories.length > 0) {
            recommendations = await Product.find({
                category: { $in: [...new Set(purchasedCategories)] },
                stock: { $gt: 0 }
            }).limit(5);
        }

        // If no matching products, show available products
        if (recommendations.length === 0) {
            recommendations = await Product.find({
                stock: { $gt: 0 }
            }).limit(5);
        }

        res.status(200).json({
            message: 'Product recommendations generated successfully',
            recommendationEngine: 'Local fallback (RapidMiner not connected)',
            recommendations
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to generate recommendations',
            error: error.message
        });
    }
};
