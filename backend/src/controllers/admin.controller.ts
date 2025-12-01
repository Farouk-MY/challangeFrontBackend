import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Get dashboard overview statistics
export const getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get current date ranges
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Parallel queries for better performance
        const [
            // Order Statistics
            totalOrders,
            todayOrders,
            monthOrders,
            lastMonthOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,

            // Revenue Statistics
            totalRevenue,
            todayRevenue,
            monthRevenue,
            lastMonthRevenue,

            // Product Statistics
            totalProducts,
            lowStockProducts,
            outOfStockProducts,

            // User Statistics
            totalUsers,
            todayUsers,
            monthUsers,
            verifiedUsers,

            // Category Statistics
            totalCategories,

            // Review Statistics
            totalReviews,
            averageRating,

            // Contact Statistics
            pendingContacts,

            // Wishlist Statistics
            totalWishlistItems,

            // Cart Statistics
            totalCartItems,
        ] = await Promise.all([
            // Orders
            prisma.order.count(),
            prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
            prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.order.count({
                where: {
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
                }
            }),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.count({ where: { status: 'PROCESSING' } }),
            prisma.order.count({ where: { status: 'SHIPPED' } }),
            prisma.order.count({ where: { status: 'DELIVERED' } }),

            // Revenue
            prisma.order.aggregate({
                where: { status: { not: 'CANCELLED' } },
                _sum: { total: true },
            }),
            prisma.order.aggregate({
                where: {
                    status: { not: 'CANCELLED' },
                    createdAt: { gte: startOfToday },
                },
                _sum: { total: true },
            }),
            prisma.order.aggregate({
                where: {
                    status: { not: 'CANCELLED' },
                    createdAt: { gte: startOfMonth },
                },
                _sum: { total: true },
            }),
            prisma.order.aggregate({
                where: {
                    status: { not: 'CANCELLED' },
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
                },
                _sum: { total: true },
            }),

            // Products
            prisma.product.count(),
            prisma.product.count({ where: { stock: { lte: 10, gt: 0 } } }),
            prisma.product.count({ where: { stock: 0 } }),

            // Users
            prisma.user.count(),
            prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
            prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.user.count({ where: { isVerified: true } }),

            // Categories
            prisma.category.count(),

            // Reviews
            prisma.review.count(),
            prisma.review.aggregate({ _avg: { rating: true } }),

            // Contacts
            prisma.contact.count({ where: { status: 'PENDING' } }),

            // Wishlists
            prisma.wishlist.count(),

            // Carts
            prisma.cartItem.count(),
        ]);

        // Calculate growth percentages
        const orderGrowth = lastMonthOrders > 0
            ? ((monthOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
            : '0';

        const revenueGrowth = (lastMonthRevenue._sum.total || 0) > 0
            ? (((monthRevenue._sum.total || 0) - (lastMonthRevenue._sum.total || 0)) / (lastMonthRevenue._sum.total || 0) * 100).toFixed(1)
            : '0';

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    orders: {
                        total: totalOrders,
                        today: todayOrders,
                        thisMonth: monthOrders,
                        growth: `${orderGrowth}%`,
                        pending: pendingOrders,
                        processing: processingOrders,
                        shipped: shippedOrders,
                        delivered: deliveredOrders,
                    },
                    revenue: {
                        total: totalRevenue._sum.total || 0,
                        today: todayRevenue._sum.total || 0,
                        thisMonth: monthRevenue._sum.total || 0,
                        growth: `${revenueGrowth}%`,
                    },
                    products: {
                        total: totalProducts,
                        lowStock: lowStockProducts,
                        outOfStock: outOfStockProducts,
                    },
                    users: {
                        total: totalUsers,
                        today: todayUsers,
                        thisMonth: monthUsers,
                        verified: verifiedUsers,
                    },
                    other: {
                        categories: totalCategories,
                        reviews: totalReviews,
                        averageRating: Number((averageRating._avg.rating || 0).toFixed(1)),
                        pendingContacts: pendingContacts,
                        wishlistItems: totalWishlistItems,
                        cartItems: totalCartItems,
                    },
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get sales analytics (last 7 days, 30 days, or 12 months)
export const getSalesAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { period = '7days' } = req.query;

        let dateRange: Date;
        let groupBy: 'day' | 'month';

        switch (period) {
            case '7days':
                dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                groupBy = 'day';
                break;
            case '30days':
                dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                groupBy = 'day';
                break;
            case '12months':
                dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
                groupBy = 'month';
                break;
            default:
                dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                groupBy = 'day';
        }

        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: dateRange },
                status: { not: 'CANCELLED' },
            },
            select: {
                createdAt: true,
                total: true,
            },
        });

        // Group by day or month
        const salesData: { [key: string]: { date: string; revenue: number; orders: number } } = {};

        orders.forEach(order => {
            const dateKey = groupBy === 'day'
                ? order.createdAt.toISOString().split('T')[0]
                : `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;

            if (!salesData[dateKey]) {
                salesData[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
            }

            salesData[dateKey].revenue += order.total;
            salesData[dateKey].orders += 1;
        });

        const chartData = Object.values(salesData).sort((a, b) =>
            a.date.localeCompare(b.date)
        );

        res.status(200).json({
            success: true,
            data: {
                period,
                chartData,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get top selling products
export const getTopProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { limit = '10' } = req.query;

        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: parseInt(limit as string),
        });

        // Get product details
        const productsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    include: {
                        category: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });

                return {
                    product,
                    totalSold: item._sum.quantity || 0,
                    orderCount: item._count.id,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: {
                topProducts: productsWithDetails,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get recent orders
export const getRecentOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { limit = '10' } = req.query;

        const recentOrders = await prisma.order.findMany({
            take: parseInt(limit as string),
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    select: {
                        quantity: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            data: {
                recentOrders: recentOrders.map(order => ({
                    ...order,
                    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get low stock products
export const getLowStockProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { threshold = '10' } = req.query;

        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: {
                    lte: parseInt(threshold as string),
                    gt: 0,
                },
            },
            include: {
                category: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                stock: 'asc',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                lowStockProducts,
                count: lowStockProducts.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get revenue by category
export const getRevenueByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    include: {
                        orderItems: true,
                    },
                },
            },
        });

        const revenueByCategory = categories.map(category => {
            const revenue = category.products.reduce((catTotal: number, product) => {
                const productRevenue = product.orderItems.reduce((prodTotal: number, orderItem) => {
                    return prodTotal + (orderItem.price * orderItem.quantity);
                }, 0);
                return catTotal + productRevenue;
            }, 0);

            return {
                category: category.name,
                revenue,
                productCount: category.products.length,
            };
        }).sort((a, b) => b.revenue - a.revenue);

        res.status(200).json({
            success: true,
            data: {
                revenueByCategory,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get customer statistics
export const getCustomerStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [
            allUsers,
            newCustomersThisMonth,
        ] = await Promise.all([
            // Get all users with their orders
            prisma.user.findMany({
                include: {
                    orders: {
                        where: {
                            status: { not: 'CANCELLED' },
                        },
                        select: {
                            total: true,
                        },
                    },
                },
            }),
            // New customers this month
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
            }),
        ]);

        const topCustomersWithStats = allUsers
            .map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                totalOrders: user.orders.length,
                totalSpent: user.orders.reduce((sum: number, order) => sum + order.total, 0),
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                topCustomers: topCustomersWithStats,
                newCustomersThisMonth,
            },
        });
    } catch (error) {
        next(error);
    }
};