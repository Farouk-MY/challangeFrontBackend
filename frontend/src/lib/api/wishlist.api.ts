import apiClient from './client';
import { ApiResponse, WishlistItem } from '@/types';

export const wishlistApi = {
    // Get user's wishlist
    get: async (): Promise<ApiResponse<{ wishlist: WishlistItem[] }>> => {
        const response = await apiClient.get('/wishlist');
        return response.data;
    },

    // Add product to wishlist
    add: async (productId: string): Promise<ApiResponse<{ wishlist: WishlistItem }>> => {
        const response = await apiClient.post('/wishlist/add', { productId });
        return response.data;
    },

    // Remove product from wishlist
    remove: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/wishlist/remove/${id}`);
        return response.data;
    },

    // Check if product is in wishlist
    check: async (
        productId: string
    ): Promise<ApiResponse<{ inWishlist: boolean; wishlistId?: string }>> => {
        const response = await apiClient.get(`/wishlist/check/${productId}`);
        return response.data;
    },

    // Clear entire wishlist
    clear: async (): Promise<ApiResponse> => {
        const response = await apiClient.delete('/wishlist/clear');
        return response.data;
    },
};