'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Truck, Home, Mail, ArrowRight } from 'lucide-react';
import { useOrder } from '@/lib/react-query/hooks/useOrders';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import ErrorDisplay from '@/components/shared/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const { data, isLoading, error } = useOrder(orderId || '');
    const order = data?.data?.order;

    // Confetti effect on mount
    useEffect(() => {
        if (order) {
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#10b981', '#3b82f6', '#8b5cf6'],
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#10b981', '#3b82f6', '#8b5cf6'],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [order]);

    if (isLoading) return <LoadingPage />;
    if (error || !order) {
        return (
            <ErrorDisplay
                title="Order not found"
                message="We couldn't find your order. Please check your order history."
            />
        );
    }

    const steps = [
        { icon: CheckCircle2, label: 'Order Placed', completed: true },
        { icon: Package, label: 'Processing', completed: order.status !== 'PENDING' },
        { icon: Truck, label: 'Shipped', completed: order.status === 'SHIPPED' || order.status === 'DELIVERED' },
        { icon: Home, label: 'Delivered', completed: order.status === 'DELIVERED' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
            <div className="container-custom py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Success Header */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="text-center space-y-4"
                    >
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold">Order Placed Successfully!</h1>
                        <p className="text-muted-foreground text-lg">
                            Thank you for your order. We've sent a confirmation email to your inbox.
                        </p>
                    </motion.div>

                    {/* Order Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Order Details</span>
                                    <span className="text-sm font-mono text-muted-foreground">
                                        #{order.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Order Info */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                                        <p className="font-medium">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                                        <p className="font-medium capitalize">
                                            {order.paymentMethod.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ${order.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                                        <p className="font-medium capitalize">{order.status}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Shipping Address */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Shipping Address
                                    </h3>
                                    <div className="p-4 rounded-lg bg-muted">
                                        <p className="font-medium">{order.shippingAddress.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.shippingAddress.street}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                            {order.shippingAddress.zipCode}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.shippingAddress.country}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            📞 {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Order Items */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Package className="w-4 h-4" />
                                        Items ({order.items?.length || 0})
                                    </h3>
                                    <div className="space-y-3">
                                        {order.items?.map((item: any) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-4 p-3 rounded-lg bg-muted"
                                            >
                                                {item.Product?.images?.[0] && (
                                                    <img
                                                        src={item.Product.images[0]}
                                                        alt="Product"
                                                        className="w-16 h-16 rounded object-cover"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {item.Product?.name || 'Product'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Order Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {steps.map((step, index) => (
                                        <div key={index} className="flex items-center gap-4 pb-8 last:pb-0">
                                            {/* Icon */}
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    step.completed
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                <step.icon className="w-6 h-6" />
                                            </div>
                                            {/* Label */}
                                            <div className="flex-1">
                                                <p
                                                    className={`font-medium ${
                                                        step.completed ? '' : 'text-muted-foreground'
                                                    }`}
                                                >
                                                    {step.label}
                                                </p>
                                            </div>
                                            {/* Line */}
                                            {index < steps.length - 1 && (
                                                <div
                                                    className={`absolute left-6 top-12 w-0.5 h-8 ${
                                                        step.completed ? 'bg-green-500' : 'bg-muted'
                                                    }`}
                                                    style={{ marginTop: `${index * 80}px` }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            size="lg"
                            className="flex-1 gradient-primary"
                            onClick={() => router.push('/orders')}
                        >
                            View All Orders
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push('/products')}
                        >
                            Continue Shopping
                        </Button>
                    </motion.div>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center p-6 rounded-lg bg-muted"
                    >
                        <p className="text-sm text-muted-foreground">
                            Need help with your order?{' '}
                            <button
                                onClick={() => router.push('/contact')}
                                className="text-primary hover:underline font-medium"
                            >
                                Contact Support
                            </button>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}