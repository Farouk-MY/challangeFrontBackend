'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/routing';
import { useRegister, useSendVerificationEmail } from '@/lib/react-query/hooks';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth.validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, ShoppingBag, ArrowRight, CheckCircle2, Moon, Sun } from 'lucide-react';

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

export default function RegisterPage() {
    const t = useTranslations();
    const { theme, setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const { mutate: register, isPending } = useRegister();
    const { mutate: sendVerificationEmail } = useSendVerificationEmail();

    const {
        register: registerField,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password');

    const passwordRequirements = [
        { label: 'At least 6 characters', met: password?.length >= 6 },
        { label: 'One uppercase letter', met: /[A-Z]/.test(password || '') },
        { label: 'One lowercase letter', met: /[a-z]/.test(password || '') },
        { label: 'One number', met: /[0-9]/.test(password || '') },
    ];

    const onSubmit = (data: RegisterInput) => {
        setUserEmail(data.email);
        register(data, {
            onSuccess: () => {
                // Send verification email after successful registration
                sendVerificationEmail();
                setRegistrationComplete(true);
            },
        });
    };

    // Show verification message after registration
    if (registrationComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 max-w-md w-full"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6"
                    >
                        <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </motion.div>

                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Verify Your Email
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            We've sent a verification link to{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {userEmail}
                            </span>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Click the link in the email to verify your account and start shopping!
                        </p>
                    </div>

                    <div className="mt-8 space-y-3">
                        <Button className="w-full gradient-primary" asChild>
                            <Link href="/login">
                                Continue to Login
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => sendVerificationEmail()}
                        >
                            Resend Verification Email
                        </Button>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
                        Didn't receive the email? Check your spam folder or click resend.
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Register Card */}
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
                    <motion.div variants={itemVariants} className="text-center mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-2xl mb-4 shadow-lg"
                        >
                            <ShoppingBag className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {t('auth.registerTitle')}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Join {t('common.appName')} today
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                                {t('auth.name')}
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...registerField('name')}
                                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-blue-500"
                                />
                            </div>
                            {errors.name && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 dark:text-red-400 text-xs"
                                >
                                    {errors.name.message}
                                </motion.p>
                            )}
                        </motion.div>

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
                                    {...registerField('email')}
                                    className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:border-blue-500"
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
                                    {...registerField('password')}
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
                                {t('auth.confirmPassword')}
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...registerField('confirmPassword')}
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

                        {/* Submit */}
                        <motion.div variants={itemVariants} className="pt-2">
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
                                            <span>Creating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>{t('auth.signUp')}</span>
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

                    {/* Login */}
                    <motion.p variants={itemVariants} className="text-center text-slate-600 dark:text-slate-400 text-sm">
                        {t('auth.alreadyHaveAccount')}{' '}
                        <Link
                            href="/login"
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                        >
                            {t('auth.signIn')}
                        </Link>
                    </motion.p>
                </motion.div>
            </motion.div>
        </div>
    );
}