'use client';

import { useState } from 'react';
import { useUpdateOrderStatus } from '@/lib/react-query/hooks';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Order, OrderStatus } from '@/types';
import { format } from 'date-fns';
import { Package, User, MapPin, CreditCard, Calendar } from 'lucide-react';

interface OrderDetailsDialogProps {
    order: Order;
    open: boolean;
    onClose: () => void;
}

const statusOptions: OrderStatus[] = [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
];

export default function OrderDetailsDialog({
                                               order,
                                               open,
                                               onClose,
                                           }: OrderDetailsDialogProps) {
    const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

    const handleUpdateStatus = () => {
        if (newStatus !== order.status) {
            updateStatus(
                { id: order.id, status: newStatus },
                {
                    onSuccess: () => {
                        onClose();
                    },
                }
            );
        }
    };

    const shippingAddress = order.shippingAddress as any;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>Order #{order.id.slice(0, 8)}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs">Date</span>
                                </div>
                                <p className="text-sm font-medium">
                                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Package className="w-4 h-4" />
                                    <span className="text-xs">Items</span>
                                </div>
                                <p className="text-sm font-medium">{order.items.length} items</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="text-xs">Payment</span>
                                </div>
                                <p className="text-sm font-medium capitalize">
                                    {order.paymentMethod.replace('_', ' ')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-4">
                                <div className="text-muted-foreground mb-1 text-xs">Total</div>
                                <p className="text-lg font-bold text-green-600">
                                    ${order.total.toFixed(2)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Customer Info */}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4" />
                                <h3 className="font-semibold">Customer Information</h3>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">{order.user?.name}</p>
                                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4" />
                                <h3 className="font-semibold">Shipping Address</h3>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p>{shippingAddress?.name}</p>
                                <p>{shippingAddress?.street}</p>
                                <p>
                                    {shippingAddress?.city}, {shippingAddress?.state}{' '}
                                    {shippingAddress?.zipCode}
                                </p>
                                <p>{shippingAddress?.country}</p>
                                <p className="text-muted-foreground">
                                    Phone: {shippingAddress?.phone}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Items */}
                    <Card>
                        <CardContent className="pt-4">
                            <h3 className="font-semibold mb-3">Order Items</h3>
                            <div className="space-y-3">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                        {item.Product && (
                                            <>
                                                <img
                                                    src={item.Product.images[0] || '/placeholder.png'}
                                                    alt={item.Product.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.Product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Quantity: {item.quantity}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                ${item.price.toFixed(2)} each
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-green-600">
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Update Status */}
                    <Card>
                        <CardContent className="pt-4">
                            <h3 className="font-semibold mb-3">Update Order Status</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Select
                                        value={newStatus}
                                        onValueChange={(value) => setNewStatus(value as OrderStatus)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleUpdateStatus}
                                    disabled={isPending || newStatus === order.status}
                                >
                                    {isPending ? 'Updating...' : 'Update Status'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardContent className="pt-4">
                            <h3 className="font-semibold mb-3">Order Timeline</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                                    <div className="flex-1">
                                        <p className="font-medium">Order Placed</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                </div>

                                {order.status !== 'PENDING' && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                        <div className="flex-1">
                                            <p className="font-medium">Status: {order.status}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(order.updatedAt), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {order.isDelivered && order.deliveredAt && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                                        <div className="flex-1">
                                            <p className="font-medium">Delivered</p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(order.deliveredAt), 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}