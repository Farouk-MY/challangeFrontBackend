import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import {
    createOrderSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
} from '../validators/order.validator';

// Create new order from cart
export const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const validatedData = createOrderSchema.parse(req.body);
        const { shippingAddress, paymentMethod } = validatedData;

        // Get user's cart with items
        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new AppError('Cart is empty', 400);
        }

        // Validate stock availability for all items
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                throw new AppError(
                    `Insufficient stock for product: ${item.product.name}`,
                    400
                );
            }
        }

        // Calculate total
        const total = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        // Create order with transaction
        const order = await prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    userId: req.user!.userId,
                    total,
                    shippingAddress,
                    paymentMethod,
                    status: 'PENDING',
                },
            });

            // Create order items and update product stock
            for (const item of cart.items) {
                await tx.orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price, // Store price at time of order
                    },
                });

                // Decrease product stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // Clear cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            // Return order ID
            return newOrder.id;
        });

        // Fetch complete order details after transaction
        const completeOrder = await prisma.order.findUnique({
            where: { id: order },
            include: {
                items: true,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: { order: completeOrder },
        });
    } catch (error) {
        next(error);
    }
};

// Get user's orders
export const getUserOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const query = orderQuerySchema.parse(req.query);
        const page = parseInt(query.page);
        const limit = parseInt(query.limit);
        const skip = (page - 1) * limit;

        const where: any = { userId: req.user.userId };

        if (query.status) {
            where.status = query.status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get single order by ID
export const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check if user owns this order (or is admin)
        if (order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
            throw new AppError('Not authorized', 403);
        }

        res.status(200).json({
            success: true,
            data: { order },
        });
    } catch (error) {
        next(error);
    }
};

// Cancel order (user can only cancel PENDING orders)
export const cancelOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Check ownership
        if (order.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // Only PENDING orders can be cancelled by users
        if (order.status !== 'PENDING') {
            throw new AppError('Only pending orders can be cancelled', 400);
        }

        // Update order status and restore stock
        await prisma.$transaction(async (tx) => {
            // Update order status
            await tx.order.update({
                where: { id },
                data: { status: 'CANCELLED' },
            });

            // Restore product stock
            for (const item of order.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity,
                        },
                    },
                });
            }
        });

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
        });
    } catch (error) {
        next(error);
    }
};

// ========== ADMIN ROUTES ==========

// Get all orders (Admin only)
export const getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const query = orderQuerySchema.parse(req.query);
        const page = parseInt(query.page);
        const limit = parseInt(query.limit);
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.userId) {
            where.userId = query.userId;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const validatedData = updateOrderStatusSchema.parse(req.body);
        const { status } = validatedData;

        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status,
                ...(status === 'DELIVERED' && {
                    isDelivered: true,
                    deliveredAt: new Date(),
                }),
            },
            include: {
                items: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: { order: updatedOrder },
        });
    } catch (error) {
        next(error);
    }
};

// Get order statistics (Admin only)
export const getOrderStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
        ] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.count({ where: { status: 'PROCESSING' } }),
            prisma.order.count({ where: { status: 'SHIPPED' } }),
            prisma.order.count({ where: { status: 'DELIVERED' } }),
            prisma.order.count({ where: { status: 'CANCELLED' } }),
            prisma.order.aggregate({
                where: {
                    status: {
                        not: 'CANCELLED',
                    },
                },
                _sum: {
                    total: true,
                },
            }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalOrders,
                    pendingOrders,
                    processingOrders,
                    shippedOrders,
                    deliveredOrders,
                    cancelledOrders,
                    totalRevenue: totalRevenue._sum.total || 0,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};