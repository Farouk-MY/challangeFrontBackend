import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api';
import { queryKeys } from '../client';
import { toast } from 'sonner';

// Get all categories
export const useCategories = () => {
    return useQuery({
        queryKey: queryKeys.categories.all,
        queryFn: categoriesApi.getAll,
    });
};

// Get category by ID
export const useCategory = (id: string) => {
    return useQuery({
        queryKey: queryKeys.categories.byId(id),
        queryFn: () => categoriesApi.getById(id),
        enabled: !!id,
    });
};

// Create category (Admin)
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoriesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            toast.success('Category created successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create category');
        },
    });
};

// Update category (Admin)
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            categoriesApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.categories.byId(variables.id)
            });
            toast.success('Category updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update category');
        },
    });
};

// Delete category (Admin)
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoriesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
            toast.success('Category deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete category');
        },
    });
};