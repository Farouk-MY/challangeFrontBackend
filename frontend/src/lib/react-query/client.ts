import { QueryClient, DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
    queries: {
        // Global defaults for all queries
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    },
    mutations: {
        // Global defaults for all mutations
        retry: 0,
    },
};

export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
});

// Query keys factory for better organization
export const queryKeys = {
    // Auth
    auth: {
        me: ['auth', 'me'] as const,
    },

    // Products
    products: {
        all: (params?: any) => ['products', 'list', params] as const,
        byId: (id: string) => ['products', 'detail', id] as const,
        byCategory: (slug: string, params?: any) => ['products', 'category', slug, params] as const,
    },

    // Categories
    categories: {
        all: ['categories', 'list'] as const,
        byId: (id: string) => ['categories', 'detail', id] as const,
    },

    // Cart
    cart: {
        get: ['cart'] as const,
    },

    // Orders
    orders: {
        user: (params?: any) => ['orders', 'user', params] as const,
        byId: (id: string) => ['orders', 'detail', id] as const,
        all: (params?: any) => ['orders', 'all', params] as const,
        stats: ['orders', 'stats'] as const,
    },

    // Wishlist
    wishlist: {
        get: ['wishlist'] as const,
        check: (productId: string) => ['wishlist', 'check', productId] as const,
    },

    // Reviews
    reviews: {
        product: (productId: string) => ['reviews', 'product', productId] as const,
        userReview: (productId: string) => ['reviews', 'user', productId] as const,
        userReviews: ['reviews', 'user', 'all'] as const,
    },

    // Users
    users: {
        addresses: ['users', 'addresses'] as const,
        addressById: (id: string) => ['users', 'addresses', id] as const,
    },

    // Contact
    contact: {
        all: (params?: any) => ['contact', 'all', params] as const,
        byId: (id: string) => ['contact', 'detail', id] as const,
        stats: ['contact', 'stats'] as const,
    },

    // Admin Dashboard
    admin: {
        dashboardStats: ['admin', 'dashboard', 'stats'] as const,
        salesAnalytics: (period: string) => ['admin', 'sales', period] as const,
        topProducts: (limit: number) => ['admin', 'top-products', limit] as const,
        recentOrders: (limit: number) => ['admin', 'recent-orders', limit] as const,
        lowStock: (threshold: number) => ['admin', 'low-stock', threshold] as const,
        revenueByCategory: ['admin', 'revenue-category'] as const,
        customerStats: ['admin', 'customer-stats'] as const,
    },
};