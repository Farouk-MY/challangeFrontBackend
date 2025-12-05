'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/routing';
import { useLogin, useSendVerificationEmail } from '@/lib/react-query/hooks';
import { loginSchema, type LoginInput } from '@/lib/validations/auth.validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    visible: {
        y: 0,
        opacity: 1,
    },
};

export default function LoginPage() {
    const t = useTranslations();
    const { theme, setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [verificationError, setVerificationError] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const { mutate: login, isPending, error } = useLogin();
    const { mutate: resendVerification, isPending: isResending } = useSendVerificationEmail();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        setUserEmail(data.email);
        setVerificationError(false);

        login(data, {
            onError: (error: any) => {
                // Check if it's a verification error (403)
                if (error.response?.status === 403) {
                    setVerificationError(true);
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Login Card */}
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
                            {t('common.welcome')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {t('auth.loginTitle')}
                        </p>
                    </motion.div>

                    {/* ✅ Verification Error Alert */}
                    {verificationError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <Alert variant="destructive" className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                <AlertDescription className="text-amber-800 dark:text-amber-300">
                                    <p className="font-semibold mb-2">Email Not Verified</p>
                                    <p className="text-sm mb-3">
                                        Please verify your email before logging in. Check your inbox for the verification link.
                                    </p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => resendVerification()}
                                        disabled={isResending}
                                        className="w-full border-amber-600 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                                    >
                                        {isResending ? 'Sending...' : 'Resend Verification Email'}
                                    </Button>
                                </AlertDescription>
                            </Alert>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                {t('auth.email')}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 dark:text-red-400 text-xs"
                                >
                                    {errors.email.message}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Password */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                                {t('auth.password')}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
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

                        {/* Remember & Forgot */}
                        <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-slate-600 dark:text-slate-400">
                                    {t('auth.rememberMe')}
                                </span>
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {t('auth.forgotPassword')}
                            </Link>
                        </motion.div>

                        {/* Submit */}
                        <motion.div variants={itemVariants}>
                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
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
                                            <span>Loading...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>{t('auth.signIn')}</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </form>

                    {/* Divider */}
                    <motion.div variants={itemVariants} className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400">
                                Or
                            </span>
                        </div>
                    </motion.div>

                    {/* Register */}
                    <motion.p variants={itemVariants} className="text-center text-slate-600 dark:text-slate-400 text-sm">
                        {t('auth.dontHaveAccount')}{' '}
                        <Link
                            href="/register"
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                            {t('auth.signUp')}
                        </Link>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
}