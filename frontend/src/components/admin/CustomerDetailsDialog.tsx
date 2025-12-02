'use client';

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users.api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
    User,
    Mail,
    Calendar,
    Shield,
    MapPin,
    ShoppingBag,
    DollarSign,
} from 'lucide-react';
import { User as UserType } from '@/types';
import { format } from 'date-fns';

interface CustomerDetailsDialogProps {
    customer: UserType;
    open: boolean;
    onClose: () => void;
}

export default function CustomerDetailsDialog({
                                                  customer,
                                                  open,
                                                  onClose,
                                              }: CustomerDetailsDialogProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'user', customer.id],
        queryFn: () => usersApi.getUserById(customer.id),
        enabled: open,
    });

    const userDetails = data?.data?.user as any;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Customer Details</DialogTitle>
                    <DialogDescription>
                        View customer information and order history
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Customer Info Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={userDetails?.avatar} />
                                        <AvatarFallback className="text-xl">
                                            {userDetails?.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold">
                                                {userDetails?.name}
                                            </h3>
                                            <Badge
                                                variant={
                                                    userDetails?.role === 'ADMIN'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                                className={
                                                    userDetails?.role === 'ADMIN'
                                                        ? 'bg-purple-500'
                                                        : ''
                                                }
                                            >
                                                {userDetails?.role === 'ADMIN' && (
                                                    <Shield className="w-3 h-3 mr-1" />
                                                )}
                                                {userDetails?.role}
                                            </Badge>
                                            {userDetails?.isVerified && (
                                                <Badge className="bg-green-500">Verified</Badge>
                                            )}
                                        </div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                {userDetails?.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Joined{' '}
                                                {format(
                                                    new Date(userDetails?.createdAt),
                                                    'MMMM dd, yyyy'
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                ID: {userDetails?.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Total Orders
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {userDetails?.orders?.length || 0}
                                            </p>
                                        </div>
                                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Total Spent
                                            </p>
                                            <p className="text-2xl font-bold text-green-600">
                                                $
                                                {userDetails?.orders
                                                    ?.reduce(
                                                        (sum: number, order: any) =>
                                                            order.status !== 'CANCELLED'
                                                                ? sum + order.total
                                                                : sum,
                                                        0
                                                    )
                                                    .toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        <DollarSign className="w-8 h-8 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Addresses */}
                        {userDetails?.addresses && userDetails.addresses.length > 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <h3 className="font-semibold">Saved Addresses</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {userDetails.addresses.map((address: any) => (
                                            <div
                                                key={address.id}
                                                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="text-sm">
                                                        <p className="font-medium">{address.name}</p>
                                                        <p className="text-muted-foreground">
                                                            {address.street}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {address.city}, {address.state}{' '}
                                                            {address.zipCode}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {address.country}
                                                        </p>
                                                        <p className="text-muted-foreground">
                                                            {address.phone}
                                                        </p>
                                                    </div>
                                                    {address.isDefault && (
                                                        <Badge variant="secondary">Default</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Order History */}
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4">Order History</h3>
                                {userDetails?.orders && userDetails.orders.length > 0 ? (
                                    <div className="space-y-3">
                                        {userDetails.orders.map((order: any) => (
                                            <div
                                                key={order.id}
                                                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        Order #{order.id.slice(0, 8)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(
                                                            new Date(order.createdAt),
                                                            'MMM dd, yyyy'
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">
                                                        ${order.total.toFixed(2)}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            order.status === 'DELIVERED'
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                        className={
                                                            order.status === 'DELIVERED'
                                                                ? 'bg-green-500'
                                                                : order.status === 'CANCELLED'
                                                                    ? 'bg-red-500'
                                                                    : ''
                                                        }
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No orders yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}