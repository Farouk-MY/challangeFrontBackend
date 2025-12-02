'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    MapPin,
    CreditCard,
    Calendar,
    Phone,
    Mail,
    Download,
} from 'lucide-react';
import { useOrder, useCancelOrder } from '@/lib/react-query/hooks/useOrders';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import ErrorDisplay from '@/components/shared/ErrorBoundary';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { OrderStatus } from '@/types';

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

const statusConfig: Record<OrderStatus, { icon: any; color: string; label: string }> = {
    PENDING: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        label: 'Pending',
    },
    PROCESSING: {
        icon: Package,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        label: 'Processing',
    },
    SHIPPED: {
        icon: Truck,
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
        label: 'Shipped',
    },
    DELIVERED: {
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        label: 'Delivered',
    },
    CANCELLED: {
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        label: 'Cancelled',
    },
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { data, isLoading, error } = useOrder(id);
    const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();

    if (isLoading) return <LoadingPage />;
    if (error || !data?.data?.order) {
        return <ErrorDisplay title="Order not found" message="The order you're looking for doesn't exist." />;
    }

    const order = data.data.order;
    const statusInfo = statusConfig[order.status as OrderStatus];
    const StatusIcon = statusInfo.icon;

    const canCancel = order.status === 'PENDING';

    const orderTimeline = [
        {
            status: 'PENDING',
            label: 'Order Placed',
            date: order.createdAt,
            completed: true,
        },
        {
            status: 'PROCESSING',
            label: 'Processing',
            date: order.updatedAt,
            completed: order.status !== 'PENDING',
        },
        {
            status: 'SHIPPED',
            label: 'Shipped',
            date: order.status === 'SHIPPED' || order.status === 'DELIVERED' ? order.updatedAt : null,
            completed: order.status === 'SHIPPED' || order.status === 'DELIVERED',
        },
        {
            status: 'DELIVERED',
            label: 'Delivered',
            date: order.status === 'DELIVERED' ? order.updatedAt : null,
            completed: order.status === 'DELIVERED',
        },
    ];

    const handleCancelOrder = () => {
        cancelOrder(id, {
            onSuccess: () => {
                router.push('/orders');
            },
        });
    };

    return (
        <ProtectedRoute requireAuth>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-slate-50 dark:bg-slate-950 border-b">
                    <div className="container-custom py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => router.push('/orders')}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold">Order Details</h1>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <Badge className={statusInfo.color}>
                                <StatusIcon className="w-4 h-4 mr-1" />
                                {statusInfo.label}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="container-custom py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Timeline</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {orderTimeline.map((step, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            step.completed
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}
                                                    >
                                                        {step.completed ? (
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        ) : (
                                                            <Clock className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    {index < orderTimeline.length - 1 && (
                                                        <div
                                                            className={`w-0.5 h-12 ${
                                                                step.completed ? 'bg-green-500' : 'bg-muted'
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <p className="font-semibold">{step.label}</p>
                                                    {step.date && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(step.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5" />
                                        Order Items ({order.items?.length || 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {order.items?.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-muted"
                                        >
                                            {item.Product?.images?.[0] && (
                                                <img
                                                    src={item.Product.images[0]}
                                                    alt={item.Product.name}
                                                    className="w-20 h-20 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold">{item.Product?.name || 'Product'}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    ${item.price.toFixed(2)} each
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            {canCancel && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" className="w-full">
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancel Order
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to cancel this order? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={handleCancelOrder}
                                                        disabled={cancelling}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">${order.total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium text-green-600">FREE</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ${order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-semibold">{order.shippingAddress.name}</p>
                                        <p className="text-muted-foreground">{order.shippingAddress.street}</p>
                                        <p className="text-muted-foreground">
                                            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                            {order.shippingAddress.zipCode}
                                        </p>
                                        <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                                        <p className="text-muted-foreground flex items-center gap-1 mt-2">
                                            <Phone className="w-3 h-3" />
                                            {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm capitalize">
                                        {order.paymentMethod.replace('_', ' ')}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Order Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Order Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order ID</span>
                                        <span className="font-mono">#{order.id.slice(0, 8)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Order Date</span>
                                        <span>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last Updated</span>
                                        <span>
                                            {new Date(order.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Need Help */}
                            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-6 text-center">
                                    <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                                    <p className="text-sm font-medium mb-1">Need help with this order?</p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Contact our support team
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push('/contact')}
                                    >
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}