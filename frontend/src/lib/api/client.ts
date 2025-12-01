import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Token management
export const tokenManager = {
    getAccessToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    },

    setAccessToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    },

    getRefreshToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken');
        }
        return null;
    },

    setRefreshToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('refreshToken', token);
        }
    },

    clearTokens: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },

    setTokens: (accessToken: string, refreshToken: string) => {
        tokenManager.setAccessToken(accessToken);
        tokenManager.setRefreshToken(refreshToken);
    },
};

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Don't retry for auth endpoints
        if (originalRequest.url?.includes('/auth/')) {
            return Promise.reject(error);
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenManager.getRefreshToken();

            if (!refreshToken) {
                // No refresh token, clear and redirect
                isRefreshing = false;
                tokenManager.clearTokens();

                // Don't redirect if already on auth pages
                if (typeof window !== 'undefined') {
                    const isAuthPage = window.location.pathname.includes('/login') ||
                        window.location.pathname.includes('/register');

                    if (!isAuthPage) {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }

            try {
                console.log('🔄 Refreshing token...');

                // Try to refresh the token
                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data.data;
                tokenManager.setAccessToken(accessToken);

                console.log('✅ Token refreshed successfully');

                // Update the Authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                processQueue(null, accessToken);
                isRefreshing = false;

                // Retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error('❌ Token refresh failed:', refreshError);
                processQueue(refreshError, null);
                tokenManager.clearTokens();
                isRefreshing = false;

                if (typeof window !== 'undefined') {
                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;