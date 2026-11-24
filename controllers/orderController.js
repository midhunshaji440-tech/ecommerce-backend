
import mongoose from 'mongoose';
import Order from '../models/order.js';
import Product from '../models/product.js';

// Create a new order
export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { products, shippingAddress } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: 'At least one product is required'
            });
        }

        if (!shippingAddress || !shippingAddress.trim()) {
            return res.status(400).json({
                message: 'Shipping address is required'
            });
        }

        let createdOrder;

        await session.withTransaction(async () => {
            let totalAmount = 0;
            const orderProducts = [];

            for (const item of products) {
                const { product: productId, quantity } = item;

                if (
                    !productId ||
                    !mongoose.Types.ObjectId.isValid(productId) ||
                    !Number.isInteger(quantity) ||
                    quantity < 1
                ) {
                    throw new Error('Invalid product ID or quantity');
                }

                const product = await Product.findById(productId).session(session);

                if (!product) {
                    throw new Error('Product not found: ' + productId);
                }

                if (product.stock < quantity) {
                    throw new Error('Insufficient stock for ' + product.name);
                }

                // Reduce product stock
                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: productId,
                        stock: { $gte: quantity }
                    },
                    {
                        $inc: { stock: -quantity }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!updatedProduct) {
                    throw new Error('Stock unavailable for ' + product.name);
                }

                const itemTotal = product.price * quantity;
                totalAmount += itemTotal;

                orderProducts.push({
                    product: product._id,
                    quantity,
                    price: product.price
                });
            }

            const orders = await Order.create(
                [{
                    user: req.user.id,
                    products: orderProducts,
                    totalAmount,
                    shippingAddress: shippingAddress.trim()
                }],
                { session }
            );

            createdOrder = orders[0];
        });

        const populatedOrder = await Order.findById(createdOrder._id)
            .populate('user', 'name email')
            .populate('products.product', 'name price');

        res.status(201).json({
            message: 'Order created successfully',
            order: populatedOrder
        });

    } catch (error) {
        res.status(400).json({
            message: 'Order creation failed',
            error: error.message
        });
    } finally {
        await session.endSession();
    }
};

// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
};

// Get a specific order
export const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid order ID'
            });
        }

        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('products.product', 'name price');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        // Users can only access their own orders
        if (
            req.user.role !== 'admin' &&
            order.user._id.toString() !== req.user.id
        ) {
            return res.status(403).json({
                message: 'You cannot access this order'
            });
        }

        res.status(200).json({ order });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve order',
            error: error.message
        });
    }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            'pending',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid order status'
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid order ID'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('products.product', 'name price');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        res.status(400).json({
            message: 'Order status update failed',
            error: error.message
        });
    }
};

// User: Cancel own pending order
export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: 'Invalid order ID'
            });
        }

        let cancelledOrder;

        await session.withTransaction(async () => {
            const order = await Order.findOne({
                _id: req.params.id,
                user: req.user.id
            }).session(session);

            if (!order) {
                throw new Error('Order not found');
            }

            if (order.status !== 'pending') {
                throw new Error('Only pending orders can be cancelled');
            }

            // Restore stock
            for (const item of order.products) {
                await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }

            order.status = 'cancelled';
            await order.save({ session });

            cancelledOrder = order;
        });

        res.status(200).json({
            message: 'Order cancelled and product stock restored',
            order: cancelledOrder
        });

    } catch (error) {
        res.status(400).json({
            message: 'Order cancellation failed',
            error: error.message
        });
    } finally {
        await session.endSession();
    }
};
