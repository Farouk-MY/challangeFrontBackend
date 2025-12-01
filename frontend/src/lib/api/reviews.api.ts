import apiClient from './client';
import { ApiResponse, Review, ReviewStats } from '@/types';

export const reviewsApi = {
    // Get reviews for a product
    getProductReviews: async (
        productId: string
    ): Promise<ApiResponse<{ reviews: Review[]; stats: ReviewStats }>> => {
        const response = await apiClient.get(`/reviews/product/${productId}`);
        return response.data;
    },

    // Get user's review for a product
    getUserReview: async (
        productId: string
    ): Promise<ApiResponse<{ review: Review | null; hasReviewed: boolean }>> => {
        const response = await apiClient.get(`/reviews/product/${productId}/my-review`);
        return response.data;
    },

    // Get all user's reviews
    getUserReviews: async (): Promise<ApiResponse<{ reviews: Review[]; total: number }>> => {
        const response = await apiClient.get('/reviews/my-reviews');
        return response.data;
    },

    // Create review
    create: async (data: {
        productId: string;
        rating: number;
        comment: string;
    }): Promise<ApiResponse<{ review: Review }>> => {
        const response = await apiClient.post('/reviews', data);
        return response.data;
    },

    // Update review
    update: async (
        id: string,
        data: {
            rating?: number;
            comment?: string;
        }
    ): Promise<ApiResponse<{ review: Review }>> => {
        const response = await apiClient.put(`/reviews/${id}`, data);
        return response.data;
    },

    // Delete review
    delete: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/reviews/${id}`);
        return response.data;
    },
};