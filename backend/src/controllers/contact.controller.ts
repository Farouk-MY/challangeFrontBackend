import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendEmail, emailTemplates } from '../services/email.service';
import {
    createContactSchema,
    replyContactSchema,
    updateContactStatusSchema,
    contactQuerySchema,
} from '../validators/contact.validator';

// Submit contact form (Public)
export const submitContact = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createContactSchema.parse(req.body);

        const contact = await prisma.contact.create({
            data: validatedData,
        });

        // Send confirmation email to user
        await sendEmail({
            to: contact.email,
            subject: 'We received your message - NeonShop',
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📬 Message Received!</h1>
              </div>
              <div class="content">
                <h2>Hi ${contact.name}!</h2>
                <p>Thank you for contacting NeonShop. We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your Message:</strong></p>
                <p style="background: white; padding: 15px; border-left: 4px solid #667eea;">${contact.message}</p>
                <p>We typically respond within 24-48 hours.</p>
              </div>
              <div class="footer">
                <p>© 2024 NeonShop. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
        }).catch(err => console.error('Failed to send confirmation email:', err));

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            data: { contact },
        });
    } catch (error) {
        next(error);
    }
};

// Get single contact message
export const getContactById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const contact = await prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) {
            throw new AppError('Contact message not found', 404);
        }

        res.status(200).json({
            success: true,
            data: { contact },
        });
    } catch (error) {
        next(error);
    }
};

// ========== ADMIN ROUTES ==========

// Get all contact messages (Admin only)
export const getAllContacts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const query = contactQuerySchema.parse(req.query);
        const page = parseInt(query.page);
        const limit = parseInt(query.limit);
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query.status) {
            where.status = query.status;
        }

        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { subject: { contains: query.search, mode: 'insensitive' } },
                { message: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.contact.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                contacts,
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

// Reply to contact message (Admin only)
export const replyToContact = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;
        const validatedData = replyContactSchema.parse(req.body);

        const contact = await prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) {
            throw new AppError('Contact message not found', 404);
        }

        // Update contact with reply
        const updatedContact = await prisma.contact.update({
            where: { id },
            data: {
                reply: validatedData.reply,
                repliedAt: new Date(),
                repliedBy: req.user.userId,
                status: 'RESOLVED',
            },
        });

        // Send reply email to user
        await sendEmail({
            to: contact.email,
            subject: `Re: ${contact.subject} - NeonShop`,
            html: emailTemplates.contactReply(contact.name, validatedData.reply),
        }).catch(err => console.error('Failed to send reply email:', err));

        res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            data: { contact: updatedContact },
        });
    } catch (error) {
        next(error);
    }
};

// Update contact status (Admin only)
export const updateContactStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const validatedData = updateContactStatusSchema.parse(req.body);

        const contact = await prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) {
            throw new AppError('Contact message not found', 404);
        }

        const updatedContact = await prisma.contact.update({
            where: { id },
            data: { status: validatedData.status },
        });

        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            data: { contact: updatedContact },
        });
    } catch (error) {
        next(error);
    }
};

// Delete contact message (Admin only)
export const deleteContact = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const contact = await prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) {
            throw new AppError('Contact message not found', 404);
        }

        await prisma.contact.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Get contact statistics (Admin only)
export const getContactStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const [
            totalMessages,
            pendingMessages,
            inProgressMessages,
            resolvedMessages,
        ] = await Promise.all([
            prisma.contact.count(),
            prisma.contact.count({ where: { status: 'PENDING' } }),
            prisma.contact.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.contact.count({ where: { status: 'RESOLVED' } }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalMessages,
                    pendingMessages,
                    inProgressMessages,
                    resolvedMessages,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};