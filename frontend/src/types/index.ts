// ========== ENUMS ==========
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum ContactStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
}

// ========== USER TYPES ==========
export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    avatar?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Address {
    id: string;
    userId: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

// ========== PRODUCT TYPES ==========
export interface Category {
    id: string;
    name: string;
    nameAr?: string;
    slug: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
}

export interface Product {
    id: string;
    name: string;
    nameAr?: string;
    description: string;
    descriptionAr?: string;
    price: number;
    stock: number;
    images: string[];
    featured: boolean;
    categoryId: string;
    category: {
        id: string;
        name: string;
        nameAr?: string;
        slug: string;
    };
    createdAt: string;
    updatedAt: string;
    reviews?: Review[];
}

// ========== CART TYPES ==========
export interface CartItem {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product: Product;
    createdAt: string;
    updatedAt: string;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CartSummary {
    itemCount: number;
    totalQuantity: number;
    subtotal: string;
}

// ========== ORDER TYPES ==========
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    createdAt: string;
    Product?: Product;
}

export interface Order {
    id: string;
    userId: string;
    total: number;
    status: OrderStatus;
    shippingAddress: any; // JSON object
    paymentMethod: string;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

// ========== WISHLIST TYPES ==========
export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product: Product;
    createdAt: string;
}

// ========== REVIEW TYPES ==========
export interface Review {
    id: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
    };
    product?: {
        id: string;
        name: string;
        images: string[];
        price: number;
    };
}

export interface ReviewStats {
    total: number;
    averageRating: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

// ========== CONTACT TYPES ==========
export interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: ContactStatus;
    reply?: string;
    repliedAt?: string;
    repliedBy?: string;
    createdAt: string;
    updatedAt: string;
}

// ========== API RESPONSE TYPES ==========
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        items: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

// Alternative: For responses with dynamic keys like { products: [], orders: [] }
export interface DynamicPaginatedResponse<T> {
    success: boolean;
    data: T & {
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

// ========== AUTH TYPES ==========
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface TokenResponse {
    accessToken: string;
}

// ========== ADMIN DASHBOARD TYPES ==========
export interface DashboardStats {
    overview: {
        orders: {
            total: number;
            today: number;
            thisMonth: number;
            growth: string;
            pending: number;
            processing: number;
            shipped: number;
            delivered: number;
        };
        revenue: {
            total: number;
            today: number;
            thisMonth: number;
            growth: string;
        };
        products: {
            total: number;
            lowStock: number;
            outOfStock: number;
        };
        users: {
            total: number;
            today: number;
            thisMonth: number;
            verified: number;
        };
        other: {
            categories: number;
            reviews: number;
            averageRating: number;
            pendingContacts: number;
            wishlistItems: number;
            cartItems: number;
        };
    };
}

export interface SalesAnalytics {
    period: string;
    chartData: Array<{
        date: string;
        revenue: number;
        orders: number;
    }>;
}

export interface TopProduct {
    product: Product;
    totalSold: number;
    orderCount: number;
}

// ========== FORM INPUT TYPES ==========
export interface ProductQueryParams {
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    featured?: string;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';
}

export interface OrderQueryParams {
    page?: string;
    limit?: string;
    status?: OrderStatus;
    userId?: string;
}

export interface ContactQueryParams {
    page?: string;
    limit?: string;
    status?: ContactStatus;
    search?: string;
}