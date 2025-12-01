import apiClient from './client';
import {
    ApiResponse,
    DashboardStats,
    SalesAnalytics,
    TopProduct,
    Order,
    Product,
} from '@/types';

export const adminApi = {
    // Get dashboard statistics
    getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
        const response = await apiClient.get('/admin/dashboard/stats');
        return response.data;
    },

    // Get sales analytics
    getSalesAnalytics: async (
        period: '7days' | '30days' | '12months' = '7days'
    ): Promise<ApiResponse<SalesAnalytics>> => {
        const response = await apiClient.get('/admin/dashboard/sales-analytics', {
            params: { period },
        });
        return response.data;
    },

    // Get top selling products
    getTopProducts: async (
        limit: number = 10
    ): Promise<ApiResponse<{ topProducts: TopProduct[] }>> => {
        const response = await apiClient.get('/admin/dashboard/top-products', {
            params: { limit },
        });
        return response.data;
    },

    // Get recent orders
    getRecentOrders: async (
        limit: number = 10
    ): Promise<ApiResponse<{ recentOrders: Order[] }>> => {
        const response = await apiClient.get('/admin/dashboard/recent-orders', {
            params: { limit },
        });
        return response.data;
    },

    // Get low stock products
    getLowStockProducts: async (
        threshold: number = 10
    ): Promise<ApiResponse<{ lowStockProducts: Product[]; count: number }>> => {
        const response = await apiClient.get('/admin/dashboard/low-stock', {
            params: { threshold },
        });
        return response.data;
    },

    // Get revenue by category
    getRevenueByCategory: async (): Promise<
        ApiResponse<{
            revenueByCategory: Array<{
                category: string;
                revenue: number;
                productCount: number;
            }>;
        }>
    > => {
        const response = await apiClient.get('/admin/dashboard/revenue-by-category');
        return response.data;
    },

    // Get customer statistics
    getCustomerStats: async (): Promise<
        ApiResponse<{
            topCustomers: Array<{
                id: string;
                name: string;
                email: string;
                totalOrders: number;
                totalSpent: number;
            }>;
            newCustomersThisMonth: number;
        }>
    > => {
        const response = await apiClient.get('/admin/dashboard/customer-stats');
        return response.data;
    },
};