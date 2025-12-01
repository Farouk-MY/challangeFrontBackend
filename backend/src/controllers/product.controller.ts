import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import {
    createProductSchema,
    updateProductSchema,
    productQuerySchema,
} from '../validators/product.validator';

// Get all products with filters, search, and pagination
export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const query = productQuerySchema.parse(req.query);

        const page = parseInt(query.page);
        const limit = parseInt(query.limit);
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (query.category) {
            where.categoryId = query.category;
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        if (query.minPrice || query.maxPrice) {
            where.price = {};
            if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
            if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
        }

        if (query.featured === 'true') {
            where.featured = true;
        }

        // Build orderBy clause
        let orderBy: any = { createdAt: 'desc' }; // default

        if (query.sort) {
            switch (query.sort) {
                case 'price_asc':
                    orderBy = { price: 'asc' };
                    break;
                case 'price_desc':
                    orderBy = { price: 'desc' };
                    break;
                case 'newest':
                    orderBy = { createdAt: 'desc' };
                    break;
                case 'oldest':
                    orderBy = { createdAt: 'asc' };
                    break;
                case 'name_asc':
                    orderBy = { name: 'asc' };
                    break;
                case 'name_desc':
                    orderBy = { name: 'desc' };
                    break;
            }
        }

        // Get products and total count
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
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
                orderBy,
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get single product by ID
export const getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        nameAr: true,
                        slug: true,
                    },
                },
                reviews: {
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
                },
            },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        res.status(200).json({
            success: true,
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

// Create new product (Admin only)
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createProductSchema.parse(req.body);

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id: validatedData.categoryId },
        });

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        const product = await prisma.product.create({
            data: validatedData,
            include: {
                category: true,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

// Update product (Admin only)
export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const validatedData = updateProductSchema.parse(req.body);

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            throw new AppError('Product not found', 404);
        }

        // If categoryId is being updated, check if it exists
        if (validatedData.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: validatedData.categoryId },
            });

            if (!category) {
                throw new AppError('Category not found', 404);
            }
        }

        const product = await prisma.product.update({
            where: { id },
            data: validatedData,
            include: {
                category: true,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

// Delete product (Admin only)
export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        await prisma.product.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Get products by category slug
export const getProductsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { slug } = req.params;
        const query = productQuerySchema.parse(req.query);

        const page = parseInt(query.page);
        const limit = parseInt(query.limit);
        const skip = (page - 1) * limit;

        // Find category by slug
        const category = await prisma.category.findUnique({
            where: { slug },
        });

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        // Get products in this category
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: { categoryId: category.id },
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
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.product.count({ where: { categoryId: category.id } }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                category,
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};