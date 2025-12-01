import { z } from 'zod';

export const createOrderSchema = z.object({
    shippingAddress: z.object({
        name: z.string().min(2, 'Name is required'),
        phone: z.string().min(8, 'Valid phone number is required'),
        street: z.string().min(5, 'Street address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().optional(),
        country: z.string().min(2, 'Country is required'),
        zipCode: z.string().optional(),
    }),
    paymentMethod: z.enum(['cash_on_delivery', 'credit_card', 'paypal']).default('cash_on_delivery'),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const orderQuerySchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
    userId: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;