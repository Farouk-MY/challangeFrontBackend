'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useForgotPassword } from '@/lib/react-query/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2, ShoppingBag } from 'lucide-react';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

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

export default function ForgotPasswordPage() {
    const t = useTranslations();
    const [emailSent, setEmailSent] = useState(false);
    const { mutate: forgotPassword, isPending } = useForgotPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = (data: ForgotPasswordInput) => {
        forgotPassword(data.email, {
            onSuccess: () => {
                setEmailSent(true);
            },
        });
    };

    if (emailSent) {
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
                        className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </motion.div>

                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Check Your Email
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            We've sent a password reset link to{' '}
                            <span className="font-semibold text-slate-900 dark:text-white">
                {getValues('email')}
              </span>
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Click the link in the email to reset your password. The link will expire in 1 hour.
                        </p>
                    </div>

                    <div className="mt-8 space-y-3">
                        <Button className="w-full gradient-primary" asChild>
                            <Link href="/login">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setEmailSent(false)}
                        >
                            Try Another Email
                        </Button>
                    </div>
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
                            Forgot Password?
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            No worries! Enter your email and we'll send you reset instructions.
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email */}
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
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
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </Button>
                        </motion.div>
                    </form>

                    {/* Back to Login */}
                    <motion.div variants={itemVariants} className="mt-6">
                        <Button variant="ghost" className="w-full" asChild>
                            <Link href="/login">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}