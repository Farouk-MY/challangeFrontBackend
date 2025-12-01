import apiClient from './client';
import {
    ApiResponse,
    DynamicPaginatedResponse,
    Product,
    ProductQueryParams,
    Category,
} from '@/types';

export const productsApi = {
    // Get all products with filters
    getAll: async (params?: ProductQueryParams): Promise<DynamicPaginatedResponse<{ products: Product[] }>> => {
        const response = await apiClient.get('/products', { params });
        return response.data;
    },

    // Get single product by ID
    getById: async (id: string): Promise<ApiResponse<{ product: Product }>> => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // Get products by category slug
    getByCategory: async (
        slug: string,
        params?: ProductQueryParams
    ): Promise<DynamicPaginatedResponse<{ category: Category; products: Product[] }>> => {
        const response = await apiClient.get(`/products/category/${slug}`, { params });
        return response.data;
    },

    // Create product (Admin)
    create: async (data: {
        name: string;
        nameAr?: string;
        description: string;
        descriptionAr?: string;
        price: number;
        stock: number;
        images: string[];
        categoryId: string;
        featured?: boolean;
    }): Promise<ApiResponse<{ product: Product }>> => {
        const response = await apiClient.post('/products', data);
        return response.data;
    },

    // Update product (Admin)
    update: async (
        id: string,
        data: Partial<{
            name: string;
            nameAr?: string;
            description: string;
            descriptionAr?: string;
            price: number;
            stock: number;
            images: string[];
            categoryId: string;
            featured: boolean;
        }>
    ): Promise<ApiResponse<{ product: Product }>> => {
        const response = await apiClient.put(`/products/${id}`, data);
        return response.data;
    },

    // Delete product (Admin)
    delete: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },
};