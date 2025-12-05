import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { queryKeys } from '@/lib/react-query/client';
import { LoginCredentials, RegisterCredentials } from '@/types';
import { toast } from 'sonner';
import { useSyncGuestCart } from './useCart';


// Get current user
export const useMe = () => {
    return useQuery({
        queryKey: queryKeys.auth.me,
        queryFn: authApi.getMe,
        retry: false,
        staleTime: Infinity,
        // Don't run if no tokens exist
        enabled: typeof window !== 'undefined' &&
            !!localStorage.getItem('accessToken'),
    });
};

// Register mutation - ✅ COMPLETELY FIXED - NO AUTO LOGIN
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
        onSuccess: (data) => {
            // ✅ DON'T set user in cache (no tokens received)
            // ✅ DON'T redirect
            // ✅ Just show success message
            toast.success('Account created! Please check your email to verify your account.');

            // The register page component will handle showing the verification screen
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Registration failed');
        },
    });
};

// Login mutation - ✅ UPDATED - Handle verification error
export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: syncCart } = useSyncGuestCart();

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.me, {
                success: true,
                data: { user: data.data?.user },
            });

            // Sync guest cart after successful login
            syncCart();

            toast.success('Login successful!');

            if (data.data?.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Login failed';

            // ✅ Check if it's a verification error (403 status)
            if (error.response?.status === 403) {
                toast.error(message, {
                    duration: 5000, // Show longer for verification errors
                    action: {
                        label: 'Resend Email',
                        onClick: () => {
                            // User can manually resend from their email or we can add a function here
                            toast.info('Please check your email for the verification link');
                        },
                    },
                });
            } else {
                toast.error(message);
            }
        },
    });
};

// Logout mutation
export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            // Clear all queries
            queryClient.clear();
            toast.success('Logged out successfully!');
            router.push('/login');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Logout failed');
        },
    });
};

// Send verification email
export const useSendVerificationEmail = () => {
    return useMutation({
        mutationFn: authApi.sendVerificationEmail,
        onSuccess: () => {
            toast.success('Verification email sent! Check your inbox.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send verification email');
        },
    });
};

// Verify email
export const useVerifyEmail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (token: string) => authApi.verifyEmail(token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
            toast.success('Email verified successfully! You can now login.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Verification failed');
        },
    });
};

// Forgot password
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
        onSuccess: () => {
            toast.success('Password reset email sent! Check your inbox.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        },
    });
};

// Reset password
export const useResetPassword = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: ({ token, password }: { token: string; password: string }) =>
            authApi.resetPassword(token, password),
        onSuccess: () => {
            toast.success('Password reset successfully! You can now login.');
            router.push('/login');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Password reset failed');
        },
    });
};

// Change password
export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({
                         currentPassword,
                         newPassword,
                     }: {
            currentPassword: string;
            newPassword: string;
        }) => authApi.changePassword(currentPassword, newPassword),
        onSuccess: () => {
            toast.success('Password changed successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change password');
        },
    });
};