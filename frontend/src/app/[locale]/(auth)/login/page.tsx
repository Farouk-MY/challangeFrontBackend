'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/routing';
import { useLogin } from '@/lib/react-query/hooks';
import { loginSchema, type LoginInput } from '@/lib/validations/auth.validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight, Moon, Sun } from 'lucide-react';

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
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        login(data);
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