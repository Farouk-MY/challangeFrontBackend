import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { cartApi, productsApi } from '@/lib/api';
import { queryKeys } from '@/lib/react-query/client';
import { guestCartManager } from '@/lib/utils/guestCart';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

// Get cart - works for both authenticated and guest users
export const useCart = () => {
    const hasToken = typeof window !== 'undefined' &&
        !!localStorage.getItem('accessToken');

    // For authenticated users - fetch from API
    const apiCart = useQuery({
        queryKey: queryKeys.cart.get,
        queryFn: cartApi.get,
        enabled: hasToken,
        retry: false,
    });

    // For guest users - use localStorage
    const [guestCart, setGuestCart] = useState<any>(null);
    const [isLoadingGuest, setIsLoadingGuest] = useState(true);

    useEffect(() => {
        if (!hasToken && typeof window !== 'undefined') {
            // Load guest cart and fetch product details
            const loadGuestCart = async () => {
                setIsLoadingGuest(true);
                const cart = guestCartManager.getCart();

                if (cart.items.length > 0) {
                    try {
                        // Fetch product details for each item
                        const itemsWithProducts = await Promise.all(
                            cart.items.map(async (item) => {
                                try {
                                    const response = await productsApi.getById(item.productId);
                                    if (!response.data?.product) return null;

                                    return {
                                        id: item.productId,
                                        productId: item.productId,
                                        quantity: item.quantity,
                                        product: response.data.product,
                                        cartId: 'guest',
                                        createdAt: item.addedAt,
                                        updatedAt: item.addedAt,
                                    };
                                } catch (error) {
                                    console.error('Error fetching product:', item.productId);
                                    return null;
                                }
                            })
                        );

                        const validItems = itemsWithProducts.filter(item => item !== null);
                        const subtotal = validItems.reduce(
                            (sum, item: any) => sum + (item.product.price * item.quantity),
                            0
                        );

                        setGuestCart({
                            success: true,
                            data: {
                                cart: {
                                    id: 'guest',
                                    userId: 'guest',
                                    items: validItems,
                                    createdAt: cart.updatedAt,
                                    updatedAt: cart.updatedAt,
                                },
                                summary: {
                                    itemCount: validItems.length,
                                    totalQuantity: validItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
                                    subtotal: subtotal.toFixed(2),
                                },
                            },
                        });
                    } catch (error) {
                        console.error('Error loading guest cart:', error);
                    }
                } else {
                    setGuestCart({
                        success: true,
                        data: {
                            cart: { id: 'guest', userId: 'guest', items: [], createdAt: '', updatedAt: '' },
                            summary: { itemCount: 0, totalQuantity: 0, subtotal: '0.00' },
                        },
                    });
                }
                setIsLoadingGuest(false);
            };

            loadGuestCart();
        }
    }, [hasToken]);

    // Return API cart for authenticated users, guest cart for others
    if (hasToken) {
        return apiCart;
    }

    return {
        data: guestCart,
        isLoading: isLoadingGuest,
        error: null,
        refetch: () => {},
    };
};

// Add to cart - works for both authenticated and guest
export const useAddToCart = () => {
    const queryClient = useQueryClient();
    const hasToken = typeof window !== 'undefined' &&
        !!localStorage.getItem('accessToken');

    return useMutation({
        mutationFn: async (data: { productId: string; quantity: number }) => {
            if (hasToken) {
                // Authenticated - use API
                return await cartApi.addItem(data);
            } else {
                // Guest - use localStorage
                guestCartManager.addItem(data.productId, data.quantity);
                return { success: true };
            }
        },
        onSuccess: () => {
            if (hasToken) {
                queryClient.invalidateQueries({ queryKey: queryKeys.cart.get });
            } else {
                // Force re-render by invalidating
                window.dispatchEvent(new Event('guest-cart-updated'));
            }
            toast.success('Added to cart!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        },
    });
};

// Update cart item
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    const hasToken = typeof window !== 'undefined' &&
        !!localStorage.getItem('accessToken');

    return useMutation({
        mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
            if (hasToken) {
                return await cartApi.updateItem(id, { quantity });
            } else {
                guestCartManager.updateItem(id, quantity);
                return { success: true };
            }
        },
        onSuccess: () => {
            if (hasToken) {
                queryClient.invalidateQueries({ queryKey: queryKeys.cart.get });
            } else {
                window.dispatchEvent(new Event('guest-cart-updated'));
            }
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update cart');
        },
    });
};

// Remove from cart
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    const hasToken = typeof window !== 'undefined' &&
        !!localStorage.getItem('accessToken');

    return useMutation({
        mutationFn: async (id: string) => {
            if (hasToken) {
                return await cartApi.removeItem(id);
            } else {
                guestCartManager.removeItem(id);
                return { success: true };
            }
        },
        onSuccess: () => {
            if (hasToken) {
                queryClient.invalidateQueries({ queryKey: queryKeys.cart.get });
            } else {
                window.dispatchEvent(new Event('guest-cart-updated'));
            }
            toast.success('Removed from cart');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove from cart');
        },
    });
};

// Clear cart
export const useClearCart = () => {
    const queryClient = useQueryClient();
    const hasToken = typeof window !== 'undefined' &&
        !!localStorage.getItem('accessToken');

    return useMutation({
        mutationFn: async () => {
            if (hasToken) {
                return await cartApi.clear();
            } else {
                guestCartManager.clearCart();
                return { success: true };
            }
        },
        onSuccess: () => {
            if (hasToken) {
                queryClient.invalidateQueries({ queryKey: queryKeys.cart.get });
            } else {
                window.dispatchEvent(new Event('guest-cart-updated'));
            }
            toast.success('Cart cleared');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to clear cart');
        },
    });
};

// Sync guest cart with user cart after login
export const useSyncGuestCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const guestCart = guestCartManager.getCart();

            if (guestCart.items.length === 0) {
                return { success: true, message: 'No items to sync' };
            }

            // Add each guest cart item to user cart
            const results = await Promise.all(
                guestCart.items.map(item =>
                    cartApi.addItem({ productId: item.productId, quantity: item.quantity })
                        .catch(err => ({ error: err, productId: item.productId }))
                )
            );

            // Clear guest cart after sync
            guestCartManager.clearCart();

            return { success: true, results };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.cart.get });
            toast.success('Cart synced successfully!');
        },
        onError: (error: any) => {
            console.error('Failed to sync cart:', error);
            toast.error('Some items could not be synced');
        },
    });
};