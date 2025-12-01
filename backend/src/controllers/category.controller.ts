import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import {
    createCategorySchema,
    updateCategorySchema,
} from '../validators/category.validator';

// Get all categories
export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });

        res.status(200).json({
            success: true,
            data: { categories },
        });
    } catch (error) {
        next(error);
    }
};

// Get single category by ID
export const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        res.status(200).json({
            success: true,
            data: { category },
        });
    } catch (error) {
        next(error);
    }
};

// Create new category (Admin only)
export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createCategorySchema.parse(req.body);

        // Check if slug already exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug: validatedData.slug },
        });

        if (existingCategory) {
            throw new AppError('Category with this slug already exists', 400);
        }

        const category = await prisma.category.create({
            data: validatedData,
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category },
        });
    } catch (error) {
        next(error);
    }
};

// Update category (Admin only)
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const validatedData = updateCategorySchema.parse(req.body);

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            throw new AppError('Category not found', 404);
        }

        // If slug is being updated, check if it's already taken
        if (validatedData.slug && validatedData.slug !== existingCategory.slug) {
            const slugExists = await prisma.category.findUnique({
                where: { slug: validatedData.slug },
            });

            if (slugExists) {
                throw new AppError('Category with this slug already exists', 400);
            }
        }

        const category = await prisma.category.update({
            where: { id },
            data: validatedData,
        });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: { category },
        });
    } catch (error) {
        next(error);
    }
};

// Delete category (Admin only)
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        // Check if category has products
        if (category._count.products > 0) {
            throw new AppError(
                'Cannot delete category with existing products. Please remove or reassign products first.',
                400
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};