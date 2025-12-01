import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { queryKeys } from '../client';
import { toast } from 'sonner';

// Update profile
export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
            toast.success('Profile updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });
};

// Get all addresses
export const useAddresses = () => {
    return useQuery({
        queryKey: queryKeys.users.addresses,
        queryFn: usersApi.getAddresses,
    });
};

// Get single address
export const useAddress = (id: string) => {
    return useQuery({
        queryKey: queryKeys.users.addressById(id),
        queryFn: () => usersApi.getAddressById(id),
        enabled: !!id,
    });
};

// Create address
export const useCreateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses });
            toast.success('Address added successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add address');
        },
    });
};

// Update address
export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            usersApi.updateAddress(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses });
            queryClient.invalidateQueries({
                queryKey: queryKeys.users.addressById(variables.id)
            });
            toast.success('Address updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update address');
        },
    });
};

// Set default address
export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.setDefaultAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses });
            toast.success('Default address updated!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to set default address');
        },
    });
};

// Delete address
export const useDeleteAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: usersApi.deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.addresses });
            toast.success('Address deleted successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete address');
        },
    });
};