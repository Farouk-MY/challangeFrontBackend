import apiClient, { tokenManager } from './client';
import {
    ApiResponse,
    AuthResponse,
    TokenResponse,
    User,
    LoginCredentials,
    RegisterCredentials,
} from '@/types';

export const authApi = {
    // Register new user
    register: async (credentials: RegisterCredentials): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post('/auth/register', credentials);

        // Save tokens
        if (response.data.success && response.data.data) {
            const { accessToken, refreshToken } = response.data.data;
            tokenManager.setTokens(accessToken, refreshToken);
        }

        return response.data;
    },

    // Login user
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post('/auth/login', credentials);

        // Save tokens
        if (response.data.success && response.data.data) {
            const { accessToken, refreshToken } = response.data.data;
            tokenManager.setTokens(accessToken, refreshToken);
        }

        return response.data;
    },

    // Get current user
    getMe: async (): Promise<ApiResponse<{ user: User }>> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    // Logout
    logout: async (): Promise<ApiResponse> => {
        const response = await apiClient.post('/auth/logout');
        tokenManager.clearTokens();
        return response.data;
    },

    // Refresh access token
    refreshToken: async (refreshToken: string): Promise<ApiResponse<TokenResponse>> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken });

        if (response.data.success && response.data.data) {
            tokenManager.setAccessToken(response.data.data.accessToken);
        }

        return response.data;
    },

    // Send verification email
    sendVerificationEmail: async (): Promise<ApiResponse> => {
        const response = await apiClient.post('/auth/send-verification');
        return response.data;
    },

    // Verify email
    verifyEmail: async (token: string): Promise<ApiResponse> => {
        const response = await apiClient.post('/auth/verify-email', { token });
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email: string): Promise<ApiResponse> => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
        const response = await apiClient.post('/auth/reset-password', { token, password });
        return response.data;
    },

    // Change password
    changePassword: async (
        currentPassword: string,
        newPassword: string
    ): Promise<ApiResponse> => {
        const response = await apiClient.post('/auth/change-password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};