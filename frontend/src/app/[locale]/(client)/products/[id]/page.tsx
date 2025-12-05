'use client';

import { useState, use } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import {
    Heart,
    ShoppingCart,
    Minus,
    Plus,
    Star,
    Truck,
    Shield,
    RefreshCw,
    ChevronLeft,
} from 'lucide-react';
import { useProduct } from '@/lib/react-query/hooks/useProducts';
import { useAddToCart } from '@/lib/react-query/hooks/useCart';
import { useCheckWishlist, useToggleWishlist } from '@/lib/react-query/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import ErrorDisplay from '@/components/shared/ErrorBoundary';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = use(params);
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const { data, isLoading, error } = useProduct(id);
    const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

    // Wishlist hooks
    const { data: wishlistCheck } = useCheckWishlist(id);
    const isWishlisted = wishlistCheck?.data?.inWishlist || false;
    const wishlistId = wishlistCheck?.data?.wishlistId;
    const { mutate: toggleWishlist, isPending: togglingWishlist } = useToggleWishlist();

    if (isLoading) return <LoadingPage />;
    if (error) return <ErrorDisplay title={t('productDetail.notFound')} />;

    const product = data?.data?.product;
    if (!product) return <ErrorDisplay title={t('productDetail.notFound')} />;

    const productName = locale === 'ar' && product.nameAr ? product.nameAr : product.name;
    const productDesc =
        locale === 'ar' && product.descriptionAr
            ? product.descriptionAr
            : product.description;

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = () => {
        addToCart({ productId: product.id, quantity });
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };

    const handleWishlist = () => {
        toggleWishlist({
            productId: product.id,
            isInWishlist: isWishlisted,
            wishlistId: wishlistId,
        });
    };

    // Calculate average rating
    const averageRating = product.reviews?.length
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="border-b bg-slate-50 dark:bg-slate-950">
                <div className="container-custom py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t('productDetail.back')}
                    </button>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Images Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border"
                        >
                            <img
                                src={product.images[selectedImage] || '/placeholder.png'}
                                alt={productName}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* Thumbnail Images */}
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImage === index
                                                ? 'border-primary ring-2 ring-primary/20'
                                                : 'border-transparent hover:border-muted'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${productName} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {product.featured && <Badge className="badge-info">{t('productDetail.featured')}</Badge>}
                            {isOutOfStock && (
                                <Badge variant="destructive">{t('products.outOfStock')}</Badge>
                            )}
                            {isLowStock && <Badge variant="outline">{t('productDetail.onlyLeft', { count: product.stock })}</Badge>}
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{productName}</h1>
                            <Link
                                href={`/products?category=${product.category.id}`}
                                className="text-sm text-muted-foreground hover:text-primary"
                            >
                                {locale === 'ar' && product.category.nameAr
                                    ? product.category.nameAr
                                    : product.category.name}
                            </Link>
                        </div>

                        {/* Rating */}
                        {product.reviews && product.reviews.length > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${
                                                star <= averageRating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {averageRating.toFixed(1)} ({t('productDetail.reviewsCount', { count: product.reviews.length })})
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-green-600 dark:text-green-400">
                                ${product.price.toFixed(2)}
                            </span>
                        </div>

                        {/* Description Preview */}
                        <p className="text-muted-foreground leading-relaxed">
                            {productDesc.substring(0, 200)}
                            {productDesc.length > 200 && '...'}
                        </p>

                        <Separator />

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">{t('productDetail.quantity')}</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-medium">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {t('productDetail.available', { count: product.stock })}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <Button
                                size="lg"
                                className="flex-1 gradient-primary"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || addingToCart}
                            >
                                {addingToCart ? (
                                    t('productDetail.adding')
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        {t('products.addToCart')}
                                    </>
                                )}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleWishlist}
                                disabled={togglingWishlist}
                                className={isWishlisted ? 'bg-red-50 dark:bg-red-950 border-red-200' : ''}
                            >
                                <Heart
                                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                                />
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                <Truck className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-xs text-muted-foreground">{t('productDetail.features.freeShipping')}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                <Shield className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-xs text-muted-foreground">{t('productDetail.features.securePayment')}</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                                <RefreshCw className="w-6 h-6 mb-2 text-primary" />
                                <span className="text-xs text-muted-foreground">{t('productDetail.features.easyReturns')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="description">{t('productDetail.tabs.description')}</TabsTrigger>
                            <TabsTrigger value="reviews">
                                {t('productDetail.tabs.reviews')} ({product.reviews?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-8">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed">{productDesc}</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-8">
                            {product.reviews && product.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {product.reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border rounded-lg p-6 space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                        {review.user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{review.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(review.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-4 h-4 ${
                                                                star <= review.rating
                                                                    ? 'text-yellow-400 fill-yellow-400'
                                                                    : 'text-gray-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    {t('productDetail.noReviews')}
                                </p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}