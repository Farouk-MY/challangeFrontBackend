'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3x3, List, X } from 'lucide-react';
import { useProducts } from '@/lib/react-query/hooks/useProducts';
import { useCategories } from '@/lib/react-query/hooks/useCategories';
import ProductCard from '@/components/client/ProductCard';
import { ProductsGridSkeleton } from '@/components/shared/LoadingSpinner';
import ErrorDisplay from '@/components/shared/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Get query params
    const currentPage = searchParams.get('page') || '1';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';

    // Fetch products
    const { data, isLoading, error } = useProducts({
        page: currentPage,
        limit: '12',
        sort: currentSort as any,
        category: currentCategory,
        search: currentSearch,
        minPrice: minPrice > 0 ? minPrice.toString() : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice.toString() : undefined,
    });

    // Fetch categories
    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data?.categories || [];

    const products = data?.data?.products || [];
    const pagination = data?.data?.pagination;

    // Update URL params
    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset to page 1 when filters change
        if (key !== 'page') {
            params.set('page', '1');
        }
        router.push(`/products?${params.toString()}`);
    };

    // Handle search
    const handleSearch = () => {
        updateParams('search', searchQuery);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setMinPrice(0);
        setMaxPrice(1000);
        router.push('/products');
    };

    const hasActiveFilters =
        currentSearch || currentCategory || minPrice > 0 || maxPrice < 1000;

    // Get category name
    const getCategoryName = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return '';
        return locale === 'ar' && category.nameAr ? category.nameAr : category.name;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-950 border-b">
                <div className="container-custom py-8">
                    <h1 className="text-3xl font-bold mb-2">{t('products.title')}</h1>
                    <p className="text-muted-foreground">
                        {t('productsPage.subtitle')}
                    </p>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block space-y-6">
                        <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-semibold text-lg">{t('productsPage.filters')}</h2>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-red-600 dark:text-red-400"
                                    >
                                        {t('productsPage.clearAll')}
                                    </Button>
                                )}
                            </div>

                            {/* Search */}
                            <div className="space-y-2 mb-6">
                                <Label>{t('productsPage.search')}</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder={t('productsPage.searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <Button size="icon" onClick={handleSearch}>
                                        <Search className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="space-y-2 mb-6 pb-6 border-b">
                                <Label>{t('nav.categories')}</Label>
                                <div className="space-y-2">
                                    <Button
                                        variant={!currentCategory ? 'secondary' : 'ghost'}
                                        className="w-full justify-start"
                                        onClick={() => updateParams('category', '')}
                                    >
                                        {t('productsPage.allCategories')}
                                    </Button>
                                    {categories.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={currentCategory === category.id ? 'secondary' : 'ghost'}
                                            className="w-full justify-start"
                                            onClick={() => updateParams('category', category.id)}
                                        >
                                            {locale === 'ar' && category.nameAr ? category.nameAr : category.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-4 mb-6 pb-6 border-b">
                                <Label>{t('productsPage.priceRange')}</Label>
                                <div className="space-y-4">
                                    <Slider
                                        min={0}
                                        max={1000}
                                        step={10}
                                        value={[minPrice, maxPrice]}
                                        onValueChange={([min, max]) => {
                                            setMinPrice(min);
                                            setMaxPrice(max);
                                        }}
                                        className="w-full"
                                    />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            ${minPrice}
                                        </span>
                                        <span className="text-muted-foreground">
                                            ${maxPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="space-y-2">
                                <Label>{t('productsPage.sortBy')}</Label>
                                <Select value={currentSort} onValueChange={(v) => updateParams('sort', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">{t('productsPage.sort.newest')}</SelectItem>
                                        <SelectItem value="oldest">{t('productsPage.sort.oldest')}</SelectItem>
                                        <SelectItem value="price_asc">{t('productsPage.sort.priceLowHigh')}</SelectItem>
                                        <SelectItem value="price_desc">{t('productsPage.sort.priceHighLow')}</SelectItem>
                                        <SelectItem value="name_asc">{t('productsPage.sort.nameAZ')}</SelectItem>
                                        <SelectItem value="name_desc">{t('productsPage.sort.nameZA')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Mobile Header with Filters */}
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 flex items-center gap-2">
                                <Input
                                    placeholder={t('productsPage.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="flex-1 lg:hidden"
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSearch}
                                    className="lg:hidden"
                                >
                                    <Search className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* View Toggle */}
                            <div className="hidden sm:flex items-center gap-2 border rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                    size="icon"
                                    onClick={() => setViewMode('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Mobile Filters Sheet */}
                            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="lg:hidden">
                                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                                        {t('productsPage.filters')}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80">
                                    <SheetHeader>
                                        <SheetTitle>{t('productsPage.filters')}</SheetTitle>
                                        <SheetDescription>
                                            {t('productsPage.refineSearch')}
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-6">
                                        {/* Categories */}
                                        <div className="space-y-2">
                                            <Label>{t('nav.categories')}</Label>
                                            <div className="space-y-2">
                                                <Button
                                                    variant={!currentCategory ? 'secondary' : 'ghost'}
                                                    className="w-full justify-start"
                                                    onClick={() => updateParams('category', '')}
                                                >
                                                    {t('productsPage.allCategories')}
                                                </Button>
                                                {categories.map((category) => (
                                                    <Button
                                                        key={category.id}
                                                        variant={currentCategory === category.id ? 'secondary' : 'ghost'}
                                                        className="w-full justify-start"
                                                        onClick={() => updateParams('category', category.id)}
                                                    >
                                                        {locale === 'ar' && category.nameAr ? category.nameAr : category.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price Range */}
                                        <div className="space-y-4">
                                            <Label>{t('productsPage.priceRange')}</Label>
                                            <Slider
                                                min={0}
                                                max={1000}
                                                step={10}
                                                value={[minPrice, maxPrice]}
                                                onValueChange={([min, max]) => {
                                                    setMinPrice(min);
                                                    setMaxPrice(max);
                                                }}
                                            />
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>${minPrice}</span>
                                                <span>${maxPrice}</span>
                                            </div>
                                        </div>

                                        {/* Sort */}
                                        <div className="space-y-2">
                                            <Label>{t('productsPage.sortBy')}</Label>
                                            <Select value={currentSort} onValueChange={(v) => updateParams('sort', v)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="newest">{t('productsPage.sort.newest')}</SelectItem>
                                                    <SelectItem value="price_asc">{t('productsPage.sort.priceLowHigh')}</SelectItem>
                                                    <SelectItem value="price_desc">{t('productsPage.sort.priceHighLow')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            className="w-full"
                                            onClick={() => setFiltersOpen(false)}
                                        >
                                            {t('productsPage.applyFilters')}
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-muted-foreground">{t('productsPage.activeFilters')}:</span>
                                {currentCategory && (
                                    <Badge variant="secondary" className="gap-2">
                                        {getCategoryName(currentCategory)}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => updateParams('category', '')}
                                        />
                                    </Badge>
                                )}
                                {currentSearch && (
                                    <Badge variant="secondary" className="gap-2">
                                        {t('productsPage.search')}: {currentSearch}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => {
                                                setSearchQuery('');
                                                updateParams('search', '');
                                            }}
                                        />
                                    </Badge>
                                )}
                                {(minPrice > 0 || maxPrice < 1000) && (
                                    <Badge variant="secondary" className="gap-2">
                                        ${minPrice} - ${maxPrice}
                                        <X
                                            className="w-3 h-3 cursor-pointer"
                                            onClick={() => {
                                                setMinPrice(0);
                                                setMaxPrice(1000);
                                            }}
                                        />
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-red-600 dark:text-red-400 h-7"
                                >
                                    {t('productsPage.clearAll')}
                                </Button>
                            </div>
                        )}

                        {/* Results Count */}
                        {!isLoading && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {t('productsPage.productsFound', { count: pagination?.total || 0 })}
                                </p>
                            </div>
                        )}

                        {/* Products Grid */}
                        {isLoading ? (
                            <ProductsGridSkeleton count={12} />
                        ) : error ? (
                            <ErrorDisplay
                                title={t('productsPage.error')}
                                message={t('productsPage.errorMessage')}
                                showHomeButton={false}
                            />
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    {t('productsPage.noProducts')}
                                </p>
                                <Button onClick={clearFilters}>{t('productsPage.clearFilters')}</Button>
                            </div>
                        ) : (
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'space-y-4'
                                }
                            >
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-8">
                                <Button
                                    variant="outline"
                                    disabled={pagination.page === 1}
                                    onClick={() => updateParams('page', String(pagination.page - 1))}
                                >
                                    {t('productsPage.previous')}
                                </Button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter((page) => {
                                            return (
                                                page === 1 ||
                                                page === pagination.totalPages ||
                                                Math.abs(page - pagination.page) <= 1
                                            );
                                        })
                                        .map((page, index, array) => (
                                            <>
                                                {index > 0 && array[index - 1] !== page - 1 && (
                                                    <span key={`ellipsis-${page}`} className="px-2">
                                                        ...
                                                    </span>
                                                )}
                                                <Button
                                                    key={page}
                                                    variant={page === pagination.page ? 'default' : 'outline'}
                                                    size="icon"
                                                    onClick={() => updateParams('page', String(page))}
                                                >
                                                    {page}
                                                </Button>
                                            </>
                                        ))}
                                </div>

                                <Button
                                    variant="outline"
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() => updateParams('page', String(pagination.page + 1))}
                                >
                                    {t('productsPage.next')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}