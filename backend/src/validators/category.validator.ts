import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(2, 'Category name must be at least 2 characters'),
    nameAr: z.string().optional(),
    slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    image: z.string().url().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
    nameAr: z.string().optional(),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
    image: z.string().url().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;