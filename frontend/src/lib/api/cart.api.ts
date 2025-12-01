import apiClient from './client';
import { ApiResponse, Cart, CartItem, CartSummary } from '@/types';

export const cartApi = {
    // Get user's cart
    get: async (): Promise<ApiResponse<{ cart: Cart; summary: CartSummary }>> => {
        const response = await apiClient.get('/cart');
        return response.data;
    },

    // Add item to cart
    addItem: async (data: {
        productId: string;
        quantity: number;
    }): Promise<ApiResponse<{ cartItem: CartItem }>> => {
        const response = await apiClient.post('/cart/add', data);
        return response.data;
    },

    // Update cart item quantity
    updateItem: async (
        id: string,
        data: { quantity: number }
    ): Promise<ApiResponse<{ cartItem: CartItem }>> => {
        const response = await apiClient.put(`/cart/update/${id}`, data);
        return response.data;
    },

    // Remove item from cart
    removeItem: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/cart/remove/${id}`);
        return response.data;
    },

    // Clear entire cart
    clear: async (): Promise<ApiResponse> => {
        const response = await apiClient.delete('/cart/clear');
        return response.data;
    },
};