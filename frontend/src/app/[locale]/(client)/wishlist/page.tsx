'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api';
import { useAddToCart } from '@/lib/react-query/hooks/useCart';
import { queryKeys } from '@/lib/react-query/client';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import ErrorDisplay, { EmptyState } from '@/components/shared/ErrorBoundary';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function WishlistPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Get wishlist
    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.wishlist.get,
        queryFn: wishlistApi.get,
    });

    // Add to cart mutation
    const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

    // Remove from wishlist mutation
    const { mutate: removeFromWishlist } = useMutation({
        mutationFn: wishlistApi.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.get });
            toast.success('Removed from wishlist');
        },
        onError: () => {
            toast.error('Failed to remove from wishlist');
        },
    });

    if (isLoading) return <LoadingPage />;
    if (error) return <ErrorDisplay title="Failed to load wishlist" />;

    const wishlist = data?.data?.wishlist || [];

    const handleAddToCart = (productId: string) => {
        addToCart({ productId, quantity: 1 });
    };

    return (
        <ProtectedRoute requireAuth>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-600 to-red-600 dark:from-pink-500 dark:to-red-500 text-white py-12">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                                    <Heart className="w-10 h-10 fill-current" />
                                    {t('nav.wishlist')}
                                </h1>
                                <p className="text-pink-100">
                                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container-custom py-8">
                    {wishlist.length === 0 ? (
                        <EmptyState
                            icon={<Heart className="w-12 h-12 text-muted-foreground" />}
                            title="Your wishlist is empty"
                            description="Save your favorite products and shop them later"
                            action={{
                                label: 'Start Shopping',
                                onClick: () => router.push('/products'),
                            }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {wishlist.map((item, index) => {
                                    const productName =
                                        locale === 'ar' && item.product.nameAr
                                            ? item.product.nameAr
                                            : item.product.name;
                                    const isOutOfStock = item.product.stock === 0;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            {/* Product Image */}
                                            <div
                                                onClick={() => router.push(`/products/${item.product.id}`)}
                                                className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
                                            >
                                                <img
                                                    src={item.product.images[0] || '/placeholder.png'}
                                                    alt={productName}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                {isOutOfStock && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <Badge variant="destructive" className="text-sm">
                                                            Out of Stock
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {locale === 'ar' && item.product.category.nameAr
                                                            ? item.product.category.nameAr
                                                            : item.product.category.name}
                                                    </p>
                                                    <h3
                                                        onClick={() => router.push(`/products/${item.product.id}`)}
                                                        className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                                                    >
                                                        {productName}
                                                    </h3>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                        ${item.product.price.toFixed(2)}
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.product.stock} in stock
                                                    </Badge>
                                                </div>

                                                <Button
                                                    onClick={() => handleAddToCart(item.product.id)}
                                                    disabled={isOutOfStock || addingToCart}
                                                    className="w-full gradient-primary"
                                                    size="sm"
                                                >
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Continue Shopping */}
                    {wishlist.length > 0 && (
                        <div className="mt-12 text-center">
                            <Button
                                onClick={() => router.push('/products')}
                                variant="outline"
                                size="lg"
                            >
                                Continue Shopping
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}