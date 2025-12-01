import { z } from 'zod';

export const createReviewSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    comment: z.string().min(10, 'Comment must be at least 10 characters').max(500, 'Comment must be at most 500 characters'),
});

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(10).max(500).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;