import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api';
import { queryKeys } from '../client';
import { OrderQueryParams, OrderStatus } from '@/types';
import { toast } from 'sonner';

// Get user orders
export const useUserOrders = (params?: OrderQueryParams) => {
    return useQuery({
        queryKey: queryKeys.orders.user(params),
        queryFn: () => ordersApi.getUserOrders(params),
    });
};

// Get single order
export const useOrder = (id: string) => {
    return useQuery({
        queryKey: queryKeys.orders.byId(id),
        queryFn: () => ordersApi.getById(id),
        enabled: !!id,
    });
};

// Create order
export const useCreateOrder = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ordersApi.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.user() });
            queryClient.invalidateQueries({ queryKey: queryKeys.cart.get });
            toast.success('Order placed successfully!');
            // Redirect to success page with order ID
            router.push(`/orders/success?orderId=${data.data?.order.id}`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create order');
        },
    });
};

// Cancel order
export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ordersApi.cancel,
        onSuccess: (_, orderId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.user() });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.byId(orderId) });
            toast.success('Order cancelled successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        },
    });
};

// ===== ADMIN HOOKS =====

// Get all orders (Admin)
export const useAllOrders = (params?: OrderQueryParams) => {
    return useQuery({
        queryKey: queryKeys.orders.all(params),
        queryFn: () => ordersApi.getAllOrders(params),
    });
};

// Update order status (Admin)
export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            ordersApi.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.byId(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.orders.stats });
            toast.success('Order status updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        },
    });
};

// Get order stats (Admin)
export const useOrderStats = () => {
    return useQuery({
        queryKey: queryKeys.orders.stats,
        queryFn: ordersApi.getStats,
    });
};

// Create order
