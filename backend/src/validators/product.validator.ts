import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters'),
    nameAr: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    descriptionAr: z.string().optional(),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    categoryId: z.string().min(1, 'Category is required'),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
    featured: z.boolean().optional().default(false),
});

export const updateProductSchema = z.object({
    name: z.string().min(2).optional(),
    nameAr: z.string().optional(),
    description: z.string().min(10).optional(),
    descriptionAr: z.string().optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    categoryId: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    featured: z.boolean().optional(),
});

export const productQuerySchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('12'),
    category: z.string().optional(),
    search: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    featured: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'name_asc', 'name_desc']).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;