import apiClient from './client';
import {
    ApiResponse,
    DynamicPaginatedResponse,
    Order,
    OrderStatus,
    OrderQueryParams,
} from '@/types';

export const ordersApi = {
    // Create new order from cart
    create: async (data: {
        shippingAddress: {
            name: string;
            phone: string;
            street: string;
            city: string;
            state?: string;
            country: string;
            zipCode?: string;
        };
        paymentMethod: string;
    }): Promise<ApiResponse<{ order: Order }>> => {
        const response = await apiClient.post('/orders', data);
        return response.data;
    },

    // Get user's orders
    getUserOrders: async (
        params?: OrderQueryParams
    ): Promise<DynamicPaginatedResponse<{ orders: Order[] }>> => {
        const response = await apiClient.get('/orders/my-orders', { params });
        return response.data;
    },

    // Get single order by ID
    getById: async (id: string): Promise<ApiResponse<{ order: Order }>> => {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    },

    // Cancel order (only PENDING orders)
    cancel: async (id: string): Promise<ApiResponse> => {
        const response = await apiClient.patch(`/orders/${id}/cancel`);
        return response.data;
    },

    // ===== ADMIN ROUTES =====

    // Get all orders (Admin)
    getAllOrders: async (
        params?: OrderQueryParams
    ): Promise<DynamicPaginatedResponse<{ orders: Order[] }>> => {
        const response = await apiClient.get('/orders/admin/all', { params });
        return response.data;
    },

    // Update order status (Admin)
    updateStatus: async (
        id: string,
        status: OrderStatus
    ): Promise<ApiResponse<{ order: Order }>> => {
        const response = await apiClient.patch(`/orders/${id}/status`, { status });
        return response.data;
    },

    // Get order statistics (Admin)
    getStats: async (): Promise<
        ApiResponse<{
            stats: {
                totalOrders: number;
                pendingOrders: number;
                processingOrders: number;
                shippedOrders: number;
                deliveredOrders: number;
                cancelledOrders: number;
                totalRevenue: number;
            };
        }>
    > => {
        const response = await apiClient.get('/orders/admin/stats');
        return response.data;
    },
};