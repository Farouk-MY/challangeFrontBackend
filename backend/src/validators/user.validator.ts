import { z } from 'zod';

export const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
});

export const createAddressSchema = z.object({
    name: z.string().min(2, 'Recipient name is required'),
    phone: z.string().min(8, 'Valid phone number is required'),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    zipCode: z.string().optional(),
    isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(8).optional(),
    street: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    state: z.string().optional(),
    country: z.string().min(2).optional(),
    zipCode: z.string().optional(),
    isDefault: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;