import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { queryKeys } from '@/lib/react-query/client'; // ✅ Change this line
import { LoginCredentials, RegisterCredentials } from '@/types';
import { toast } from 'sonner';
import { useSyncGuestCart } from './useCart'; // Add this import


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

// Register mutation
export const useRegister = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
        onSuccess: (data) => {
            // Set user in cache
            queryClient.setQueryData(queryKeys.auth.me, {
                success: true,
                data: { user: data.data?.user },
            });
            toast.success('Account created successfully!');
            router.push('/');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Registration failed');
        },
    });
};

// Login mutation
export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: syncCart } = useSyncGuestCart(); // Add this

    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.auth.me, {
                success: true,
                data: { user: data.data?.user },
            });

            // Sync guest cart after successful login
            syncCart(); // Add this

            toast.success('Login successful!');

            if (data.data?.user.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Login failed');
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
            toast.success('Verification email sent!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send email');
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
            toast.success('Email verified successfully!');
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
            toast.success('Password reset successfully!');
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