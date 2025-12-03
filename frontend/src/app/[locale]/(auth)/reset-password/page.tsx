'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useResetPassword } from '@/lib/react-query/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, CheckCircle2, XCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { z } from 'zod';

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.2,
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function ResetPasswordPage() {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const password = watch('password');

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const passwordRequirements = [
        { label: 'At least 6 characters', met: password?.length >= 6 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
        { label: 'One lowercase letter', met: /[a-z]/.test(password || '') },
        { label: 'One number', met: /[0-9]/.test(password || '') },
    ];

    const onSubmit = (data: ResetPasswordInput) => {
        if (!token) return;
        resetPassword({ token, password: data.password });
    };

    // Invalid Token State
    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                        <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Invalid Reset Link
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>

                    <Button className="w-full gradient-primary" asChild>
                        <Link href="/forgot-password">
                            Request New Link
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Success State
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </motion.div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Password Reset Successfully!
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Your password has been updated. You can now login with your new password.
                    </p>

                    <Button className="w-full gradient-primary" asChild>
                        <Link href="/login">
                            Continue to Login
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative w-full max-w-md"
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800"
                >
                    {/* Logo */}
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl mb-4 shadow-lg"
                        >
                            <ShoppingBag className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Reset Your Password
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Enter your new password below
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* New Password */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mt-2"
                                >
                                    {passwordRequirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 text-xs">
                                            <CheckCircle2
                                                className={`w-3.5 h-3.5 transition-colors ${
                                                    req.met ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                            />
                                            <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}>
                        {req.label}
                      </span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 dark:text-red-400 text-xs"
                                >
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Confirm Password */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('confirmPassword')}
                                    className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 dark:text-red-400 text-xs"
                                >
                                    {errors.confirmPassword.message}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants}>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                {isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        <span>Resetting...</span>
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Back to Login */}
                    <motion.div variants={itemVariants} className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Back to Login
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}