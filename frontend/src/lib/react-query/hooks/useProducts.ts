import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { queryKeys } from '../client';
import { ProductQueryParams } from '@/types';
import { toast } from 'sonner';

// Get all products with filters
export const useProducts = (params?: ProductQueryParams) => {
    return useQuery({
        queryKey: queryKeys.products.all(params),
        queryFn: () => productsApi.getAll(params),
    });
};

// Get single product by ID
export const useProduct = (id: string) => {
    return useQuery({
        queryKey: queryKeys.products.byId(id),
        queryFn: () => productsApi.getById(id),
        enabled: !!id,
    });
};

// Get products by category
export const useProductsByCategory = (slug: string, params?: ProductQueryParams) => {
    return useQuery({
        queryKey: queryKeys.products.byCategory(slug, params),
        queryFn: () => productsApi.getByCategory(slug, params),
        enabled: !!slug,
    });
};

// Create product (Admin)
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create product');
        },
    });
};

// Update product (Admin)
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            productsApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.products.byId(variables.id) });
            toast.success('Product updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update product');
        },
    });
};

// Delete product (Admin)
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete product');
        },
    });
};