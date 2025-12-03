'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useVerifyEmail } from '@/lib/react-query/hooks';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const { mutate: verifyEmail } = useVerifyEmail();

    useEffect(() => {
        if (!token) {
            setVerificationStatus('error');
            return;
        }

        // Verify email with token
        verifyEmail(token, {
            onSuccess: () => {
                setVerificationStatus('success');
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            },
            onError: () => {
                setVerificationStatus('error');
            },
        });
    }, [token, verifyEmail, router]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 max-w-md w-full text-center"
            >
                {/* Loading State */}
                {verificationStatus === 'loading' && (
                    <div className="space-y-6">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 mx-auto"
                        >
                            <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Verifying Your Email
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Please wait while we verify your email address...
                        </p>
                    </div>
                )}

                {/* Success State */}
                {verificationStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </motion.div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Email Verified!
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Your email has been successfully verified. You'll be redirected to login in a moment...
                            </p>
                        </div>

                        <Button
                            className="w-full gradient-primary"
                            asChild
                        >
                            <Link href="/login">
                                Continue to Login
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </motion.div>
                )}

                {/* Error State */}
                {verificationStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
                        >
                            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </motion.div>

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Verification Failed
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                The verification link is invalid or has expired. Please request a new verification email.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                className="w-full gradient-primary"
                                asChild
                            >
                                <Link href="/register">
                                    Back to Register
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <Link href="/login">
                                    Go to Login
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}