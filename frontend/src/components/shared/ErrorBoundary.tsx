'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface ErrorDisplayProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHomeButton?: boolean;
}

export default function ErrorDisplay({
                                         title = 'Something went wrong',
                                         message = 'An unexpected error occurred. Please try again.',
                                         onRetry,
                                         showHomeButton = true,
                                     }: ErrorDisplayProps) {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-muted-foreground">{message}</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                    {onRetry && (
                        <Button onClick={onRetry} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    )}
                    {showHomeButton && (
                        <Button onClick={() => router.push('/')} className="gradient-primary">
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Empty State Component
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <div className="text-center space-y-4 max-w-md">
                {icon && (
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                        {icon}
                    </div>
                )}
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    {description && (
                        <p className="text-muted-foreground text-sm">{description}</p>
                    )}
                </div>
                {action && (
                    <Button onClick={action.onClick} className="gradient-primary">
                        {action.label}
                    </Button>
                )}
            </div>
        </div>
    );
}