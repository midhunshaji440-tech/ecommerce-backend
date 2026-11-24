
import Product from '../models/product.js';

// Create Product
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, image } = req.body;

        if (!name || !description || !category || price === undefined) {
            return res.status(400).json({
                message: 'Please provide all required product details'
            });
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                message: 'Price must be a valid non-negative number'
            });
        }

        if (stock !== undefined &&
            (!Number.isInteger(Number(stock)) || Number(stock) < 0)) {
            return res.status(400).json({
                message: 'Stock must be a non-negative integer'
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            price: Number(price),
            stock: stock === undefined ? 0 : Number(stock),
            image
        });

        res.status(201).json({
            message: 'Product created successfully',
            product
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to create product',
            error: error.message
        });
    }
};

// Get All Products with Search, Filter and Sort
export const getProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort } = req.query;

        const filter = {};

        if (search) {
            filter.name = {
                $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                $options: 'i'
            };
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};

            if (minPrice !== undefined) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice !== undefined) {
                filter.price.$lte = Number(maxPrice);
            }

            if (
                (minPrice !== undefined && !Number.isFinite(Number(minPrice))) ||
                (maxPrice !== undefined && !Number.isFinite(Number(maxPrice))) ||
                (minPrice !== undefined && Number(minPrice) < 0) ||
                (maxPrice !== undefined && Number(maxPrice) < 0) ||
                (minPrice !== undefined && maxPrice !== undefined &&
                    Number(minPrice) > Number(maxPrice))
            ) {
                return res.status(400).json({
                    message: 'Invalid price range'
                });
            }
        }

        let sortOption = {};

        if (sort === 'lowToHigh') {
            sortOption.price = 1;
        } else if (sort === 'highToLow') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        }

        const products = await Product.find(filter).sort(sortOption);

        res.status(200).json({
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

// Get Single Product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({
            message: 'Invalid product ID'
        });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        const allowedFields = [
            'name',
            'description',
            'category',
            'price',
            'stock',
            'image'
        ];

        const invalidFields = Object.keys(updates).filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0 || Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'Invalid or empty update fields'
            });
        }

        if (
            updates.price !== undefined &&
            (!Number.isFinite(Number(updates.price)) || Number(updates.price) < 0)
        ) {
            return res.status(400).json({
                message: 'Invalid price'
            });
        }

        if (
            updates.stock !== undefined &&
            (!Number.isInteger(Number(updates.stock)) || Number(updates.stock) < 0)
        ) {
            return res.status(400).json({
                message: 'Invalid stock'
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });

    } catch (error) {
        res.status(400).json({
            message: 'Failed to update product',
            error: error.message
        });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(400).json({
            message: 'Invalid product ID'
        });
    }
};
