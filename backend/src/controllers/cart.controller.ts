import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator';

// Get user's cart
export const getCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        // Find or create cart for user
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                        nameAr: true,
                                        slug: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // If no cart exists, create one
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: req.user.userId,
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    category: {
                                        select: {
                                            id: true,
                                            name: true,
                                            nameAr: true,
                                            slug: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
        }

        // Calculate cart totals
        const subtotal = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        res.status(200).json({
            success: true,
            data: {
                cart,
                summary: {
                    itemCount: cart.items.length,
                    totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
                    subtotal: subtotal.toFixed(2),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// Add item to cart
export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const validatedData = addToCartSchema.parse(req.body);
        const { productId, quantity } = validatedData;

        // Check if product exists and has sufficient stock
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        if (product.stock < quantity) {
            throw new AppError('Insufficient stock', 400);
        }

        // Find or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.userId },
            });
        }

        // Check if product already in cart
        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (existingCartItem) {
            // Update quantity
            const newQuantity = existingCartItem.quantity + quantity;

            if (product.stock < newQuantity) {
                throw new AppError('Insufficient stock', 400);
            }

            const updatedItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: newQuantity },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });

            return res.status(200).json({
                success: true,
                message: 'Cart updated successfully',
                data: { cartItem: updatedItem },
            });
        }

        // Add new item to cart
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        res.status(201).json({
            success: true,
            message: 'Product added to cart',
            data: { cartItem },
        });
    } catch (error) {
        next(error);
    }
};

// Update cart item quantity
export const updateCartItem = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;
        const validatedData = updateCartItemSchema.parse(req.body);
        const { quantity } = validatedData;

        // Find cart item
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: {
                cart: true,
                product: true,
            },
        });

        if (!cartItem) {
            throw new AppError('Cart item not found', 404);
        }

        // Verify ownership
        if (cartItem.cart.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // Check stock
        if (cartItem.product.stock < quantity) {
            throw new AppError('Insufficient stock', 400);
        }

        // Update quantity
        const updatedItem = await prisma.cartItem.update({
            where: { id },
            data: { quantity },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data: { cartItem: updatedItem },
        });
    } catch (error) {
        next(error);
    }
};

// Remove item from cart
export const removeFromCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        // Find cart item
        const cartItem = await prisma.cartItem.findUnique({
            where: { id },
            include: {
                cart: true,
            },
        });

        if (!cartItem) {
            throw new AppError('Cart item not found', 404);
        }

        // Verify ownership
        if (cartItem.cart.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // Delete cart item
        await prisma.cartItem.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Item removed from cart',
        });
    } catch (error) {
        next(error);
    }
};

// Clear entire cart
export const clearCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.userId },
        });

        if (!cart) {
            throw new AppError('Cart not found', 404);
        }

        // Delete all cart items
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
        });
    } catch (error) {
        next(error);
    }
};