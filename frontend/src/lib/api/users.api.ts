import { apiClient } from './client';
import { ApiResponse, PaginatedResponse, User, Address } from '@/types';

export const usersApi = {
    // Get current user profile
    getProfile: async () => {
        const response = await apiClient.get<ApiResponse<{ user: User }>>('/users/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (data: { name?: string; avatar?: string }) => {
        const response = await apiClient.put<ApiResponse<{ user: User }>>(
            '/users/profile',
            data
        );
        return response.data;
    },

    // ===== ADDRESS MANAGEMENT =====

    // Get all addresses
    getAddresses: async () => {
        const response = await apiClient.get<ApiResponse<{ addresses: Address[] }>>(
            '/users/addresses'
        );
        return response.data;
    },

    // Get address by ID
    getAddressById: async (id: string) => {
        const response = await apiClient.get<ApiResponse<{ address: Address }>>(
            `/users/addresses/${id}`
        );
        return response.data;
    },

    // Create address
    createAddress: async (data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
        const response = await apiClient.post<ApiResponse<{ address: Address }>>(
            '/users/addresses',
            data
        );
        return response.data;
    },

    // Update address
    updateAddress: async (id: string, data: Partial<Address>) => {
        const response = await apiClient.put<ApiResponse<{ address: Address }>>(
            `/users/addresses/${id}`,
            data
        );
        return response.data;
    },

    // Set default address
    setDefaultAddress: async (id: string) => {
        const response = await apiClient.patch<ApiResponse<{ address: Address }>>(
            `/users/addresses/${id}/default`
        );
        return response.data;
    },

    // Delete address
    deleteAddress: async (id: string) => {
        const response = await apiClient.delete<ApiResponse>(
            `/users/addresses/${id}`
        );
        return response.data;
    },

    // ===== ADMIN ENDPOINTS =====

    // Get all users (Admin only)
    getAllUsers: async (params?: { page?: string; limit?: string; search?: string }) => {
        const response = await apiClient.get<PaginatedResponse<User[]>>(
            '/admin/users',
            { params }
        );
        return response.data;
    },

    // Get user by ID (Admin only)
    getUserById: async (id: string) => {
        const response = await apiClient.get<ApiResponse<{ user: User }>>(
            `/admin/users/${id}`
        );
        return response.data;
    },

    // Update user role (Admin only)
    updateUserRole: async (id: string, role: 'USER' | 'ADMIN') => {
        const response = await apiClient.put<ApiResponse<{ user: User }>>(
            `/admin/users/${id}/role`,
            { role }
        );
        return response.data;
    },

    // Delete user (Admin only)
    deleteUser: async (id: string) => {
        const response = await apiClient.delete<ApiResponse>(
            `/admin/users/${id}`
        );
        return response.data;
    },
};