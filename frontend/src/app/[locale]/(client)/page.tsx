'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, ShoppingBag, Zap, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/lib/react-query/hooks/useProducts';
import ProductCard from '@/components/client/ProductCard';
import { ProductsGridSkeleton } from '@/components/shared/LoadingSpinner';
import ErrorDisplay from '@/components/shared/ErrorBoundary';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function HomePage() {
    const t = useTranslations();

    // Fetch featured products
    const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useProducts({
        featured: 'true',
        limit: '8',
    });

    const featuredProducts = featuredData?.data?.products || [];

    const features = [
        {
            icon: Zap,
            title: t('home.features.fastDelivery.title'),
            description: t('home.features.fastDelivery.description'),
            gradient: 'from-yellow-500 to-orange-500',
        },
        {
            icon: Shield,
            title: t('home.features.securePayment.title'),
            description: t('home.features.securePayment.description'),
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            icon: Truck,
            title: t('home.features.freeShipping.title'),
            description: t('home.features.freeShipping.description'),
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            icon: ShoppingBag,
            title: t('home.features.easyReturns.title'),
            description: t('home.features.easyReturns.description'),
            gradient: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-20 lg:py-32">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={containerVariants}
                            className="space-y-8"
                        >
                            <motion.div variants={itemVariants} className="inline-block">
                                <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                    ✨ {t('home.hero.welcomeBadge')}
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                            >
                                {t('home.hero.title')}{' '}
                                <span className="text-gradient-primary">{t('home.hero.titleHighlight')}</span>{' '}
                                {t('home.hero.titleEnd')}
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-lg text-muted-foreground max-w-xl"
                            >
                                {t('home.hero.description')}
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap gap-4"
                            >
                                <Button size="lg" className="gradient-primary group" asChild>
                                    <Link href="/products">
                                        {t('home.hero.shopNow')}
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/categories">{t('nav.categories')}</Link>
                                </Button>
                            </motion.div>

                            {/* Stats */}
                            <motion.div
                                variants={itemVariants}
                                className="grid grid-cols-3 gap-6 pt-8"
                            >
                                <div>
                                    <h3 className="text-3xl font-bold text-gradient-primary">
                                        10K+
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('home.stats.customers')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-gradient-success">
                                        500+
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('home.stats.products')}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-gradient-primary">
                                        4.9
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {t('home.stats.rating')}
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Content - Hero Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative"
                        >
                            <div className="relative aspect-square rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                                    alt={t('home.hero.imageAlt')}
                                    className="w-full h-full object-cover"
                                />
                                {/* Floating Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-8 right-8 glass-strong rounded-2xl p-4 shadow-2xl"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                {t('home.hero.trustedBy')}
                                            </p>
                                            <p className="font-bold">{t('home.hero.trustedUsers')}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-32 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-card rounded-xl border border-border p-6 hover:shadow-card-hover transition-shadow"
                            >
                                <div
                                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                >
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="section-padding bg-slate-50 dark:bg-slate-950">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                {t('products.featured')}
                            </h2>
                            <p className="text-muted-foreground">
                                {t('home.featuredProducts.subtitle')}
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/products">
                                {t('common.viewAll')}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    {featuredLoading ? (
                        <ProductsGridSkeleton count={8} />
                    ) : featuredError ? (
                        <ErrorDisplay
                            title={t('home.featuredProducts.error')}
                            message={t('home.featuredProducts.errorMessage')}
                            showHomeButton={false}
                        />
                    ) : featuredProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                {t('home.featuredProducts.noProducts')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white">
                <div className="container-custom text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">
                            {t('home.cta.title')}
                        </h2>
                        <p className="text-lg text-blue-100">
                            {t('home.cta.description')}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/products">{t('home.cta.browseProducts')}</Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                                asChild
                            >
                                <Link href="/register">{t('home.cta.createAccount')}</Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}