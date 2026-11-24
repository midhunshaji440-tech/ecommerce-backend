
import User from '../models/user.js';

// Get logged-in user's profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User profile not found'
            });
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve profile',
            error: error.message
        });
    }
};

// Update logged-in user's profile
export const updateMyProfile = async (req, res) => {
    try {
        const allowedFields = ['name', 'place', 'phone'];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'No valid profile fields provided'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User profile not found'
            });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(400).json({
            message: 'Profile update failed',
            error: error.message
        });
    }
};

// Delete logged-in user's account
export const deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: 'User profile not found'
            });
        }

        res.status(200).json({
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Account deletion failed',
            error: error.message
        });
    }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve users',
            error: error.message
        });
    }
};

// Admin: Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({
            message: 'Invalid user ID',
            error: error.message
        });
    }
};

// Admin: Update user
export const updateUserById = async (req, res) => {
    try {
        const allowedFields = ['name', 'place', 'phone', 'role'];
        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'No valid fields provided'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        res.status(400).json({
            message: 'User update failed',
            error: error.message
        });
    }
};

// Admin: Delete user
export const deleteUserById = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                message: 'Admin cannot delete their own account using this route'
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'User deletion failed',
            error: error.message
        });
    }
};
