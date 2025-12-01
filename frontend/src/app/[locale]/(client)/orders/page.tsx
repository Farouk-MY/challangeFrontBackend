'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Package,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    Eye,
    ChevronRight,
    Calendar,
    MapPin,
    CreditCard,
    ShoppingBag,
} from 'lucide-react';
import { useUserOrders } from '@/lib/react-query/hooks/useOrders';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import ErrorDisplay, { EmptyState } from '@/components/shared/ErrorBoundary';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStatus } from '@/types';

const statusConfig = {
    PENDING: {
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    PROCESSING: {
        label: 'Processing',
        icon: Package,
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    SHIPPED: {
        label: 'Shipped',
        icon: Truck,
        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    DELIVERED: {
        label: 'Delivered',
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        iconColor: 'text-green-600 dark:text-green-400',
    },
    CANCELLED: {
        label: 'Cancelled',
        icon: XCircle,
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        iconColor: 'text-red-600 dark:text-red-400',
    },
};

export default function OrdersPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>('all');

    const { data, isLoading, error } = useUserOrders();

    if (isLoading) return <LoadingPage />;
    if (error) return <ErrorDisplay title="Failed to load orders" />;

    const orders = data?.data?.orders || [];
    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(order => order.status.toLowerCase() === activeTab);

    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        processing: orders.filter(o => o.status === 'PROCESSING').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
    };

    return (
        <ProtectedRoute requireAuth>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-12">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {t('nav.orders')}
                            </h1>
                            <p className="text-blue-100">
                                Track and manage your orders
                            </p>
                        </motion.div>
                    </div>
                </div>

                <div className="container-custom py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-blue-500 to-indigo-600' },
                            { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-orange-500' },
                            { label: 'Processing', value: stats.processing, icon: Package, color: 'from-purple-500 to-pink-500' },
                            { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'from-green-500 to-emerald-600' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                                <p className="text-2xl font-bold">{stat.value}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs Filter */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="processing">Processing</TabsTrigger>
                            <TabsTrigger value="shipped">Shipped</TabsTrigger>
                            <TabsTrigger value="delivered">Delivered</TabsTrigger>
                            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <EmptyState
                            icon={<Package className="w-12 h-12 text-muted-foreground" />}
                            title="No orders found"
                            description={activeTab === 'all' ? "You haven't placed any orders yet" : `No ${activeTab} orders`}
                            action={{
                                label: 'Start Shopping',
                                onClick: () => router.push('/products'),
                            }}
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order, index) => {
                                const StatusIcon = statusConfig[order.status as OrderStatus].icon;
                                const statusInfo = statusConfig[order.status as OrderStatus];

                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                    {/* Order Info */}
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <Badge variant="outline" className="font-mono">
                                                                #{order.id.slice(0, 8).toUpperCase()}
                                                            </Badge>
                                                            <Badge className={statusInfo.color}>
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {statusInfo.label}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>
                                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Package className="w-4 h-4" />
                                                                <span>{order.items?.length || 0} items</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <CreditCard className="w-4 h-4" />
                                                                <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                    ${order.total.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => router.push(`/orders/${order.id}`)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </Button>
                                                        {order.status === 'DELIVERED' && (
                                                            <Button
                                                                onClick={() => router.push(`/products/${order.items[0]?.productId}`)}
                                                                className="gradient-primary"
                                                            >
                                                                Buy Again
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Order Items Preview */}
                                                {order.items && order.items.length > 0 && (
                                                    <div className="mt-4 pt-4 border-t">
                                                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                                            {order.items.slice(0, 4).map((item: any) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden"
                                                                >
                                                                    {item.Product?.images?.[0] && (
                                                                        <img
                                                                            src={item.Product.images[0]}
                                                                            alt="Product"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {order.items.length > 4 && (
                                                                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                                                                    +{order.items.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}