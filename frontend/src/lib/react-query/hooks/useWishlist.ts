import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api';
import { queryKeys } from '../client';
import { toast } from 'sonner';

// Get wishlist
export const useWishlist = () => {
    return useQuery({
        queryKey: queryKeys.wishlist.get,
        queryFn: wishlistApi.get,
    });
};

// Add to wishlist
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.get });
            toast.success('Added to wishlist!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add to wishlist');
        },
    });
};

// Remove from wishlist
export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.get });
            toast.success('Removed from wishlist');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
        },
    });
};

// Check if product is in wishlist
export const useCheckWishlist = (productId: string) => {
    return useQuery({
        queryKey: queryKeys.wishlist.check(productId),
        queryFn: () => wishlistApi.check(productId),
        enabled: !!productId,
    });
};

// Clear wishlist
export const useClearWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.clear,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.get });
            toast.success('Wishlist cleared');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to clear wishlist');
        },
    });
};

// Toggle wishlist (add or remove based on current state)
export const useToggleWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, isInWishlist, wishlistId }: {
            productId: string;
            isInWishlist: boolean;
            wishlistId?: string;
        }) => {
            if (isInWishlist && wishlistId) {
                return await wishlistApi.remove(wishlistId);
            } else {
                return await wishlistApi.add(productId);
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.get });
            queryClient.invalidateQueries({
                queryKey: queryKeys.wishlist.check(variables.productId)
            });
            toast.success(
                variables.isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!'
            );
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        },
    });
};