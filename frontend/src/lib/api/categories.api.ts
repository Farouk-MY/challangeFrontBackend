import apiClient from './client';
import { ApiResponse, Category } from '@/types';

export const categoriesApi = {
    // Get all categories
    getAll: async (): Promise<ApiResponse<{ categories: Category[] }>> => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    // Get single category by ID
    getById: async (id: string): Promise<ApiResponse<{ category: Category }>> => {
        const response = await apiClient.get(`/categories/${id}`);
        return response.data;
    },

    // Create category (Admin)
    create: async (data: {
        name: string;
        nameAr?: string;
        slug: string;
        image?: string;
    }): Promise<ApiResponse<{ category: Category }>> => {
        const response = await apiClient.post('/categories', data);
        return response.data;
    },

    // Update category (Admin)
    update: async (
        id: string,
        data: Partial<{
            name: string;
            nameAr?: string;
            slug: string;
            image?: string;
        }>
    ): Promise<ApiResponse<{ category: Category }>> => {
        const response = await apiClient.put(`/categories/${id}`, data);
        return response.data;
    },

    // Delete category (Admin)
    delete: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/categories/${id}`);
        return response.data;
    },
};