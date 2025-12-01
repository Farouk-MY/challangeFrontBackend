import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import {
    updateProfileSchema,
    createAddressSchema,
    updateAddressSchema,
} from '../validators/user.validator';

// Update user profile
export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const validatedData = updateProfileSchema.parse(req.body);

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: validatedData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// Get user addresses
export const getAddresses = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const addresses = await prisma.address.findMany({
            where: { userId: req.user.userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        res.status(200).json({
            success: true,
            data: { addresses },
        });
    } catch (error) {
        next(error);
    }
};

// Get single address
export const getAddressById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        const address = await prisma.address.findUnique({
            where: { id },
        });

        if (!address) {
            throw new AppError('Address not found', 404);
        }

        // Check ownership
        if (address.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        res.status(200).json({
            success: true,
            data: { address },
        });
    } catch (error) {
        next(error);
    }
};

// Create new address
export const createAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const validatedData = createAddressSchema.parse(req.body);

        // If this is set as default, unset other default addresses
        if (validatedData.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: req.user.userId,
                    isDefault: true,
                },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                ...validatedData,
                userId: req.user.userId,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Address created successfully',
            data: { address },
        });
    } catch (error) {
        next(error);
    }
};

// Update address
export const updateAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;
        const validatedData = updateAddressSchema.parse(req.body);

        // Check if address exists and belongs to user
        const existingAddress = await prisma.address.findUnique({
            where: { id },
        });

        if (!existingAddress) {
            throw new AppError('Address not found', 404);
        }

        if (existingAddress.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // If setting as default, unset other defaults
        if (validatedData.isDefault) {
            await prisma.address.updateMany({
                where: {
                    userId: req.user.userId,
                    isDefault: true,
                    id: { not: id },
                },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: validatedData,
        });

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: { address },
        });
    } catch (error) {
        next(error);
    }
};

// Set address as default
export const setDefaultAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        // Check if address exists and belongs to user
        const address = await prisma.address.findUnique({
            where: { id },
        });

        if (!address) {
            throw new AppError('Address not found', 404);
        }

        if (address.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        // Unset all defaults for this user
        await prisma.address.updateMany({
            where: {
                userId: req.user.userId,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // Set this address as default
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });

        res.status(200).json({
            success: true,
            message: 'Default address updated',
            data: { address: updatedAddress },
        });
    } catch (error) {
        next(error);
    }
};

// Delete address
export const deleteAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { id } = req.params;

        const address = await prisma.address.findUnique({
            where: { id },
        });

        if (!address) {
            throw new AppError('Address not found', 404);
        }

        if (address.userId !== req.user.userId) {
            throw new AppError('Not authorized', 403);
        }

        await prisma.address.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};