import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import {
    createReviewSchema,
    updateReviewSchema,
} from '../validators/review.validator';

// Get reviews for a product
export const getProductReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { productId } = req.params;

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Calculate average rating
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

        // Calculate rating distribution
        const ratingDistribution = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length,
        };

        res.status(200).json({
            success: true,
            data: {
                reviews,
                stats: {
                    total: reviews.length,
                    averageRating: Number(averageRating.toFixed(1)),
                    distribution: ratingDistribution,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get user's review for a product
export const getUserReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { productId } = req.params;

        const review = await prisma.review.findUnique({
            where: {
                productId_userId: {
                    productId,
                    userId: req.user.userId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            data: {
                review,
                hasReviewed: !!review,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Create or update review
export const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const validatedData = createReviewSchema.parse(req.body);
        const { productId, rating, comment } = validatedData;

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        // Check if user has purchased this product
        const hasPurchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: {
                    userId: req.user.userId,
                    status: 'DELIVERED',
                },
            },
        });

        if (!hasPurchased) {
            throw new AppError('You can only review products you have purchased', 403);
        }

        // Check if review already exists
        const existingReview = await prisma.review.findUnique({
            where: {
                productId_userId: {
                    productId,
                    userId: req.user.userId,
                },
            },
        });

        if (existingReview) {
            throw new AppError('You have already reviewed this product. Use update instead.', 400);
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                productId,
                userId: req.user.userId,
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: { review },
        });
    } catch (error) {
        next(error);
    }
};

// Update review
export const updateReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;
        const validatedData = updateReviewSchema.parse(req.body);

        // Check if review exists
        const existingReview = await prisma.review.findUnique({
            where: { id },
        });

        if (!existingReview) {
            throw new AppError('Review not found', 404);
        }

        // Check ownership
        if (existingReview.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // Update review
        const review = await prisma.review.update({
            where: { id },
            data: validatedData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: { review },
        });
    } catch (error) {
        next(error);
    }
};

// Delete review
export const deleteReview = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        const review = await prisma.review.findUnique({
            where: { id },
        });

        if (!review) {
            throw new AppError('Review not found', 404);
        }

        // Check ownership or admin
        if (review.userId !== req.user.userId && req.user.role !== 'ADMIN') {
            throw new AppError('Not authorized', 403);
        }

        await prisma.review.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Get all user's reviews
export const getUserReviews = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const reviews = await prisma.review.findMany({
            where: { userId: req.user.userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        images: true,
                        price: true,
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
                reviews,
                total: reviews.length,
            },
        });
    } catch (error) {
        next(error);
    }
};