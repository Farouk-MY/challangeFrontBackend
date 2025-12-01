'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/lib/react-query/hooks';
import { LoadingPage } from './LoadingSpinner';
import { tokenManager } from '@/lib/api/client';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({
                                           children,
                                           requireAuth = true,
                                           requireAdmin = false,
                                       }: ProtectedRouteProps) {
    const router = useRouter();
    const { data, isLoading, error } = useMe();

    useEffect(() => {
        // Check if tokens exist
        const hasTokens = tokenManager.getAccessToken() && tokenManager.getRefreshToken();

        if (!hasTokens && requireAuth) {
            console.log('❌ No tokens found, redirecting to login...');
            router.push('/login');
            return;
        }

        // Check if user is loaded
        if (!isLoading && requireAuth) {
            const user = data?.data?.user;

            if (!user) {
                console.log('❌ User not found, redirecting to login...');
                router.push('/login');
                return;
            }

            // Check admin access
            if (requireAdmin && user.role !== 'ADMIN') {
                console.log('❌ Not admin, redirecting to home...');
                router.push('/');
                return;
            }
        }
    }, [data, isLoading, error, requireAuth, requireAdmin, router]);

    // Show loading while checking auth
    if (isLoading && requireAuth) {
        return <LoadingPage />;
    }

    // If not requiring auth, just show children
    if (!requireAuth) {
        return <>{children}</>;
    }

    // Check if user exists
    const user = data?.data?.user;

    if (!user) {
        return null; // Will redirect in useEffect
    }

    // Check admin requirement
    if (requireAdmin && user.role !== 'ADMIN') {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}