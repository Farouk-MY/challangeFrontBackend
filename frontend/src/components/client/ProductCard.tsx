'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useAddToCart } from '@/lib/react-query/hooks/useCart';
import { useCheckWishlist, useToggleWishlist } from '@/lib/react-query/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [imageLoaded, setImageLoaded] = useState(false);

    const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

    // Check if product is in wishlist
    const { data: wishlistCheck } = useCheckWishlist(product.id);
    const isWishlisted = wishlistCheck?.data?.inWishlist || false;
    const wishlistId = wishlistCheck?.data?.wishlistId;

    // Toggle wishlist mutation
    const { mutate: toggleWishlist, isPending: togglingWishlist } = useToggleWishlist();

    const productName = locale === 'ar' && product.nameAr ? product.nameAr : product.name;
    const productImage = product.images[0] || '/placeholder.png';
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isOutOfStock) {
            toast.error(t('products.outOfStock'));
            return;
        }
        addToCart({ productId: product.id, quantity: 1 });
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleWishlist({
            productId: product.id,
            isInWishlist: isWishlisted,
            wishlistId: wishlistId,
        });
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-card-hover"
        >
            <Link href={`/products/${product.id}`}>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {/* Product Image */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 skeleton" />
                    )}
                    <img
                        src={productImage}
                        alt={productName}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.featured && (
                            <span className="badge-info">
                                {t('products.featured')}
                            </span>
                        )}
                        {isOutOfStock && (
                            <span className="badge-danger">
                                {t('products.outOfStock')}
                            </span>
                        )}
                        {isLowStock && (
                            <span className="badge-warning">
                                Low Stock
                            </span>
                        )}
                    </div>

                    {/* Quick Actions - Visible on Hover */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleWishlist}
                            disabled={togglingWishlist}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                isWishlisted
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/90 dark:bg-slate-900/90 text-foreground hover:bg-red-500 hover:text-white'
                            }`}
                        >
                            <Heart
                                className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                            />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                            <Eye className="w-5 h-5" />
                        </motion.button>
                    </div>

                    {/* Overlay - Visible on Hover */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                        <Button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || addingToCart}
                            className="w-full gradient-primary"
                            size="sm"
                        >
                            {addingToCart ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    {t('products.addToCart')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Category */}
                    <p className="text-xs text-muted-foreground mb-1">
                        {locale === 'ar' && product.category.nameAr
                            ? product.category.nameAr
                            : product.category.name}
                    </p>

                    {/* Product Name */}
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {productName}
                    </h3>

                    {/* Rating (if you have reviews) */}
                    {product.reviews && product.reviews.length > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className="w-4 h-4 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                ({product.reviews.length})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                ${product.price.toFixed(2)}
                            </span>
                        </div>

                        {/* Stock Indicator */}
                        <div className="flex items-center gap-1">
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    isOutOfStock
                                        ? 'bg-red-500'
                                        : isLowStock
                                            ? 'bg-yellow-500'
                                            : 'bg-green-500'
                                }`}
                            />
                            <span className="text-xs text-muted-foreground">
                                {isOutOfStock
                                    ? t('products.outOfStock')
                                    : isLowStock
                                        ? `${product.stock} left`
                                        : t('products.inStock')}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}