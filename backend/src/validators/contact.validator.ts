import { z } from 'zod';

export const createContactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be at most 100 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters').max(1000, 'Message must be at most 1000 characters'),
});

export const replyContactSchema = z.object({
    reply: z.string().min(10, 'Reply must be at least 10 characters').max(2000, 'Reply must be at most 2000 characters'),
});

export const updateContactStatusSchema = z.object({
    status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']),
});

export const contactQuerySchema = z.object({
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED']).optional(),
    search: z.string().optional(),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type ReplyContactInput = z.infer<typeof replyContactSchema>;
export type UpdateContactStatusInput = z.infer<typeof updateContactStatusSchema>;
export type ContactQueryInput = z.infer<typeof contactQuerySchema>;