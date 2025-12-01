// Type guard utilities to prevent undefined errors

export function safeNumber(value: number | undefined | null, fallback: number = 0): number {
    return value ?? fallback;
}

export function safeString(value: string | undefined | null, fallback: string = ''): string {
    return value ?? fallback;
}

export function safeArray<T>(value: T[] | undefined | null): T[] {
    return value ?? [];
}

export function safeAccess<T, K extends keyof T>(
    obj: T | undefined | null,
    key: K,
    fallback: T[K]
): T[K] {
    return obj?.[key] ?? fallback;
}

// Admin stats safe accessors
export const adminStatsGuards = {
    getRevenue: (stats: any) => ({
        total: safeNumber(stats?.revenue?.total, 0),
        today: safeNumber(stats?.revenue?.today, 0),
        thisMonth: safeNumber(stats?.revenue?.thisMonth, 0),
        growth: safeString(stats?.revenue?.growth, '+0%'),
    }),

    getOrders: (stats: any) => ({
        total: safeNumber(stats?.orders?.total, 0),
        today: safeNumber(stats?.orders?.today, 0),
        thisMonth: safeNumber(stats?.orders?.thisMonth, 0),
        pending: safeNumber(stats?.orders?.pending, 0),
        processing: safeNumber(stats?.orders?.processing, 0),
        shipped: safeNumber(stats?.orders?.shipped, 0),
        delivered: safeNumber(stats?.orders?.delivered, 0),
        growth: safeString(stats?.orders?.growth, '+0%'),
    }),

    getProducts: (stats: any) => ({
        total: safeNumber(stats?.products?.total, 0),
        lowStock: safeNumber(stats?.products?.lowStock, 0),
        outOfStock: safeNumber(stats?.products?.outOfStock, 0),
    }),

    getUsers: (stats: any) => ({
        total: safeNumber(stats?.users?.total, 0),
        today: safeNumber(stats?.users?.today, 0),
        thisMonth: safeNumber(stats?.users?.thisMonth, 0),
        verified: safeNumber(stats?.users?.verified, 0),
    }),
};