'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShoppingBag,
    Tag,
    Lock,
    Truck,
} from 'lucide-react';
import {
    useCart,
    useUpdateCartItem,
    useRemoveFromCart,
    useClearCart,
} from '@/lib/react-query/hooks/useCart';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function CartPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [promoCode, setPromoCode] = useState('');

    // Queries & Mutations
    const { data: cartData, isLoading } = useCart();
    const { mutate: updateItem, isPending: updating } = useUpdateCartItem();
    const { mutate: removeItem } = useRemoveFromCart();
    const { mutate: clearCart } = useClearCart();

    const cart = cartData?.data?.cart;
    const summary = cartData?.data?.summary;

    if (isLoading) return <LoadingPage />;

    const handleQuantityChange = (itemId: string, currentQty: number, delta: number) => {
        const newQty = currentQty + delta;
        if (newQty >= 1) {
            updateItem({ id: itemId, quantity: newQty });
        }
    };

    const subtotal = parseFloat(summary?.subtotal || '0');
    const shipping = subtotal > 50 ? 0 : 9.99;
    const discount = 0; // Calculate based on promo code
    const total = subtotal + shipping - discount;

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container-custom">
                    <EmptyState
                        icon={<ShoppingCart className="w-12 h-12 text-muted-foreground" />}
                        title={t('cart.emptyCart')}
                        description="Looks like you haven't added any items yet"
                        action={{
                            label: t('cart.continueShopping'),
                            onClick: () => router.push('/products'),
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-12">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {t('cart.title')}
                            </h1>
                            <p className="text-blue-100">
                                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg">
                                <ShoppingBag className="w-6 h-6" />
                                <div>
                                    <p className="text-sm text-blue-100">Subtotal</p>
                                    <p className="text-xl font-bold">${subtotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Clear Cart Button */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold">Your Items</h2>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Clear Cart
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove all items from your cart. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => clearCart()}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Clear Cart
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {cart.items.map((item, index) => {
                                const productName =
                                    locale === 'ar' && item.product.nameAr
                                        ? item.product.nameAr
                                        : item.product.name;
                                const productImage = item.product.images[0] || '/placeholder.png';

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all"
                                    >
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <Link
                                                href={`/products/${item.product.id}`}
                                                className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                                            >
                                                <img
                                                    src={productImage}
                                                    alt={productName}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            </Link>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex-1">
                                                        <Link
                                                            href={`/products/${item.product.id}`}
                                                            className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
                                                        >
                                                            {productName}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {locale === 'ar' && item.product.category.nameAr
                                                                ? item.product.category.nameAr
                                                                : item.product.category.name}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {/* Price & Quantity */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center border rounded-lg">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9"
                                                                onClick={() =>
                                                                    handleQuantityChange(item.id, item.quantity, -1)
                                                                }
                                                                disabled={item.quantity <= 1 || updating}
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </Button>
                                                            <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-9 w-9"
                                                                onClick={() =>
                                                                    handleQuantityChange(item.id, item.quantity, 1)
                                                                }
                                                                disabled={
                                                                    item.quantity >= item.product.stock || updating
                                                                }
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                              {item.product.stock} available
                            </span>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            ${item.product.price.toFixed(2)} each
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-24 space-y-6"
                        >
                            {/* Summary Card */}
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold">Order Summary</h2>
                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="font-medium">
                      {shipping === 0 ? (
                          <span className="text-green-600 dark:text-green-400">FREE</span>
                      ) : (
                          `$${shipping.toFixed(2)}`
                      )}
                    </span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Discount</span>
                                            <span className="font-medium text-green-600 dark:text-green-400">
                        -${discount.toFixed(2)}
                      </span>
                                        </div>
                                    )}
                                    {subtotal <= 50 && (
                                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                                🎉 Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-2xl text-primary">
                    ${total.toFixed(2)}
                  </span>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full gradient-primary text-lg h-12"
                                    onClick={() => router.push('/checkout')}
                                >
                                    {t('cart.checkout')}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => router.push('/products')}
                                >
                                    {t('cart.continueShopping')}
                                </Button>
                            </div>

                            {/* Promo Code */}
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-primary" />
                                    Promo Code
                                </h3>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <Button variant="outline">Apply</Button>
                                </div>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                    <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Secure Payment
                  </span>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Fast Delivery
                  </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}