import apiClient from './client';
import {
    ApiResponse,
    DynamicPaginatedResponse,
    Contact,
    ContactStatus,
    ContactQueryParams,
} from '@/types';

export const contactApi = {
    // Submit contact form (Public)
    submit: async (data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<ApiResponse<{ contact: Contact }>> => {
        const response = await apiClient.post('/contact', data);
        return response.data;
    },

    // ===== ADMIN ROUTES =====

    // Get all contact messages (Admin)
    getAll: async (
        params?: ContactQueryParams
    ): Promise<DynamicPaginatedResponse<{ contacts: Contact[] }>> => {
        const response = await apiClient.get('/contact/admin/all', { params });
        return response.data;
    },

    // Get single contact message (Admin)
    getById: async (id: string): Promise<ApiResponse<{ contact: Contact }>> => {
        const response = await apiClient.get(`/contact/${id}`);
        return response.data;
    },

    // Reply to contact message (Admin)
    reply: async (
        id: string,
        reply: string
    ): Promise<ApiResponse<{ contact: Contact }>> => {
        const response = await apiClient.post(`/contact/${id}/reply`, { reply });
        return response.data;
    },

    // Update contact status (Admin)
    updateStatus: async (
        id: string,
        status: ContactStatus
    ): Promise<ApiResponse<{ contact: Contact }>> => {
        const response = await apiClient.patch(`/contact/${id}/status`, { status });
        return response.data;
    },

    // Delete contact message (Admin)
    delete: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.delete(`/contact/${id}`);
        return response.data;
    },

    // Get contact statistics (Admin)
    getStats: async (): Promise<
        ApiResponse<{
            stats: {
                totalMessages: number;
                pendingMessages: number;
                inProgressMessages: number;
                resolvedMessages: number;
            };
        }>
    > => {
        const response = await apiClient.get('/contact/admin/stats');
        return response.data;
    },
};