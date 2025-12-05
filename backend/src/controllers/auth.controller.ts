import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateToken, generateTokenExpiry } from '../utils/tokens';
import { sendEmail, emailTemplates } from '../services/email.service';
import { AppError } from '../middleware/errorHandler';
import config from '../config/env';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} from '../validators/auth.validator';

// Register new user
// Register new user - UPDATED VERSION
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate request body
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password } = validatedData;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // ✅ Generate verification token IMMEDIATELY
        const verificationToken = generateToken();

        // Create user with verification token
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken, // ✅ Save token
                isVerified: false, // ✅ Set as not verified
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                isVerified: true,
                createdAt: true,
            },
        });

        // ✅ Create verification URL
        const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;

        // ✅ Send verification email (async - don't wait)
        sendEmail({
            to: user.email,
            subject: 'Verify Your Email - NeonShop',
            html: emailTemplates.verifyEmail(user.name, verificationUrl),
        }).catch(err => console.error('Failed to send verification email:', err));

        // ✅ Also send welcome email
        sendEmail({
            to: user.email,
            subject: 'Welcome to NeonShop!',
            html: emailTemplates.welcome(user.name),
        }).catch(err => console.error('Failed to send welcome email:', err));

        // ❌ DON'T GENERATE TOKENS - User must verify first!
        // ❌ REMOVED: const accessToken = generateAccessToken(...);
        // ❌ REMOVED: const refreshToken = generateRefreshToken(...);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            data: {
                user, // ✅ Return user but NO TOKENS
                // ❌ REMOVED: accessToken, refreshToken
            },
        });
    } catch (error) {
        next(error);
    }
};

// Login user
// Login user - UPDATED VERSION
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate request body
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // ✅ CHECK IF EMAIL IS VERIFIED
        if (!user.isVerified) {
            throw new AppError('Please verify your email before logging in. Check your inbox for the verification link.', 403);
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Refresh access token
export const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate request body
        const validatedData = refreshTokenSchema.parse(req.body);
        const { refreshToken } = validatedData;

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Check if user still exists
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        next(new AppError('Invalid or expired refresh token', 401));
    }
};

// Get current user (protected route)
export const getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

// Logout (client-side will remove tokens)
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // In a production app, you might want to:
        // 1. Add refresh token to a blacklist in Redis
        // 2. Clear any server-side session data

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Send verification email
export const sendVerificationEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        if (user.isVerified) {
            throw new AppError('Email already verified', 400);
        }

        // Generate verification token
        const verificationToken = generateToken();

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken },
        });

        // Create verification URL
        const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Verify Your Email - NeonShop',
            html: emailTemplates.verifyEmail(user.name, verificationUrl),
        });

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Verify email
export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw new AppError('Verification token is required', 400);
        }

        const user = await prisma.user.findFirst({
            where: { verificationToken: token },
        });

        if (!user) {
            throw new AppError('Invalid or expired verification token', 400);
        }

        // Update user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Forgot password
export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw new AppError('Email is required', 400);
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Don't reveal if user exists for security
            return res.status(200).json({
                success: true,
                message: 'If an account exists, a password reset email has been sent',
            });
        }

        // Generate reset token
        const resetToken = generateToken();
        const resetExpires = generateTokenExpiry();

        // Save token to database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            },
        });

        // Create reset URL
        const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request - NeonShop',
            html: emailTemplates.resetPassword(user.name, resetUrl),
        });

        res.status(200).json({
            success: true,
            message: 'If an account exists, a password reset email has been sent',
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            throw new AppError('Token and new password are required', 400);
        }

        // Validate password strength
        if (password.length < 6) {
            throw new AppError('Password must be at least 6 characters', 400);
        }

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            throw new AppError('Invalid or expired reset token', 400);
        }

        // Hash new password
        const hashedPassword = await hashPassword(password);

        // Update password and clear reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Change password (for logged-in users)
export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            throw new AppError('Current and new password are required', 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify current password
        const isPasswordValid = await comparePassword(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect', 401);
        }

        // Validate new password
        if (newPassword.length < 6) {
            throw new AppError('New password must be at least 6 characters', 400);
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        next(error);
    }
};