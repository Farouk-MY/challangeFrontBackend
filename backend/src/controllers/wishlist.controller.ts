import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { addToWishlistSchema } from '../validators/wishlist.validator';

// Get user's wishlist
export const getWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: req.user.userId },
            include: {
                product: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                nameAr: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                wishlist,
                count: wishlist.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Add product to wishlist
export const addToWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const validatedData = addToWishlistSchema.parse(req.body);
        const { productId } = validatedData;

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        // Check if already in wishlist
        const existingWishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: req.user.userId,
                    productId,
                },
            },
        });

        if (existingWishlistItem) {
            throw new AppError('Product already in wishlist', 400);
        }

        // Add to wishlist
        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: req.user.userId,
                productId,
            },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            data: { wishlistItem },
        });
    } catch (error) {
        next(error);
    }
};

// Remove product from wishlist
export const removeFromWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        // Find wishlist item
        const wishlistItem = await prisma.wishlist.findUnique({
            where: { id },
        });

        if (!wishlistItem) {
            throw new AppError('Wishlist item not found', 404);
        }

        // Verify ownership
        if (wishlistItem.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // Delete wishlist item
        await prisma.wishlist.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
        });
    } catch (error) {
        next(error);
    }
};

// Check if product is in wishlist
export const checkWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { productId } = req.params;

        const wishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: req.user.userId,
                    productId,
                },
            },
        });

        res.status(200).json({
            success: true,
            data: {
                inWishlist: !!wishlistItem,
                wishlistItem,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Clear entire wishlist
export const clearWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        await prisma.wishlist.deleteMany({
            where: { userId: req.user.userId },
        });

        res.status(200).json({
            success: true,
            message: 'Wishlist cleared successfully',
        });
    } catch (error) {
        next(error);
    }
};