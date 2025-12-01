export interface AdminDashboardStats {
    overview: {
        orders: {
            total: number;
            today: number;
            thisMonth: number;
            growth: string;
            pending: number;
            processing: number;
            shipped: number;
            delivered: number;
        };
        revenue: {
            total: number;
            today: number;
            thisMonth: number;
            growth: string;
        };
        products: {
            total: number;
            lowStock: number;
            outOfStock: number;
        };
        users: {
            total: number;
            today: number;
            thisMonth: number;
            verified: number;
        };
    };
}