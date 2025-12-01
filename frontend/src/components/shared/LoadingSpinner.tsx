import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Full Page Loading
export function LoadingPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
                <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
        </div>
    );
}

// Inline Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
        >
            <Loader2 className={`${sizeClasses[size]} text-primary`} />
        </motion.div>
    );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="aspect-square skeleton" />
            <div className="p-4 space-y-3">
                <div className="h-3 skeleton w-1/3" />
                <div className="h-4 skeleton w-full" />
                <div className="h-4 skeleton w-4/5" />
                <div className="flex items-center justify-between">
                    <div className="h-6 skeleton w-20" />
                    <div className="h-4 skeleton w-16" />
                </div>
            </div>
        </div>
    );
}

// Products Grid Skeleton
export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="p-4">
                    <div className="h-4 skeleton" />
                </td>
            ))}
        </tr>
    );
}

// Card Skeleton
export function CardSkeleton() {
    return (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
            <div className="h-6 skeleton w-1/3" />
            <div className="h-4 skeleton w-full" />
            <div className="h-4 skeleton w-4/5" />
            <div className="h-4 skeleton w-2/3" />
        </div>
    );
}