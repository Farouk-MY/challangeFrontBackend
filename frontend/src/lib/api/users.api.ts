import apiClient from './client';
import { ApiResponse, User, Address } from '@/types';

export const usersApi = {
    // Update user profile
    updateProfile: async (data: {
        name?: string;
        avatar?: string;
    }): Promise<ApiResponse<{ user: User }>> => {
        const response = await apiClient.put('/users/profile', data);
        return response.data;
    },

    // ===== ADDRESS MANAGEMENT =====

    // Get all addresses
    getAddresses: async (): Promise<ApiResponse<{ addresses: Address[] }>> => {
        const response = await apiClient.get('/users/addresses');
        return response.data;
    },

    // Get single address
    getAddressById: async (id: string): Promise<ApiResponse<{ address: Address }>> => {
        const response = await apiClient.get(`/users/addresses/${id}`);
        return response.data;
    },

    // Create address
    createAddress: async (data: {
        name: string;
        phone: string;
        street: string;
        city: string;
        state?: string;
        country: string;
        zipCode?: string;
        isDefault?: boolean;
    }): Promise<ApiResponse<{ address: Address }>> => {
        const response = await apiClient.post('/users/addresses', data);
        return response.data;
    },

    // Update address
    updateAddress: async (
        id: string,
        data: Partial<{
            name: string;
            phone: string;
            street: string;
            city: string;
            state?: string;
            country: string;
            zipCode?: string;
            isDefault: boolean;
        }>
    ): Promise<ApiResponse<{ address: Address }>> => {
        const response = await apiClient.put(`/users/addresses/${id}`, data);
        return response.data;
    },

    // Set address as default
    setDefaultAddress: async (id: string): Promise<ApiResponse<{ address: Address }>> => {
        const response = await apiClient.patch(`/users/addresses/${id}/default`);
        return response.data;
    },

    // Delete address
    deleteAddress: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/users/addresses/${id}`);
        return response.data;
    },
};