'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
    AlertTriangle,
    Eye,
    ArrowUp,
    ArrowDown,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Link } from '@/i18n/routing';

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

export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<'7days' | '30days' | '12months'>('7days');

    // Fetch dashboard stats
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['admin', 'dashboard', 'stats'],
        queryFn: adminApi.getDashboardStats,
    });

    const { data: salesData, isLoading: salesLoading } = useQuery({
        queryKey: ['admin', 'sales', period],
        queryFn: () => adminApi.getSalesAnalytics(period),
    });

    const stats = statsData?.data?.overview;

    if (statsLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${stats?.revenue.total.toFixed(2) || 0}`,
            change: stats?.revenue.growth || '0%',
            icon: DollarSign,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            trend: parseFloat(stats?.revenue.growth || '0') >= 0 ? 'up' : 'down',
        },
        {
            title: 'Total Orders',
            value: stats?.orders.total || 0,
            change: stats?.orders.growth || '0%',
            icon: ShoppingCart,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            trend: parseFloat(stats?.orders.growth || '0') >= 0 ? 'up' : 'down',
        },
        {
            title: 'Total Customers',
            value: stats?.users.total || 0,
            change: `+${stats?.users.thisMonth || 0} this month`,
            icon: Users,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            trend: 'up',
        },
        {
            title: 'Total Products',
            value: stats?.products.total || 0,
            change: `${stats?.products.lowStock || 0} low stock`,
            icon: Package,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            trend: (stats?.products.lowStock || 0) > 0 ? 'down' : 'up',
        },
    ];

    // Extract values with defaults for cleaner code
    const lowStock = stats?.products?.lowStock || 0;
    const outOfStock = stats?.products?.outOfStock || 0;
    const pendingContacts = stats?.other?.pendingContacts || 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here's what's happening with your store.
                </p>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {statCards.map((stat, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold">{stat.value}</p>
                                        <div className="flex items-center gap-2">
                                            {stat.trend === 'up' ? (
                                                <ArrowUp className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4 text-red-600" />
                                            )}
                                            <span
                                                className={`text-sm ${
                                                    stat.trend === 'up'
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                }`}
                                            >
                        {stat.change}
                      </span>
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {stats?.orders.pending || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Processing</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats?.orders.processing || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Shipped</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {stats?.orders.shipped || 0}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Delivered</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats?.orders.delivered || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Alerts & Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {lowStock > 0 && (
                            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-orange-900 dark:text-orange-100">
                                        Low Stock Alert
                                    </p>
                                    <p className="text-sm text-orange-700 dark:text-orange-300">
                                        {lowStock} products are running low on stock
                                    </p>
                                </div>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href="/admin/products">View</Link>
                                </Button>
                            </div>
                        )}
                        {outOfStock > 0 && (
                            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-red-900 dark:text-red-100">
                                        Out of Stock
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {outOfStock} products are out of stock
                                    </p>
                                </div>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href="/admin/products">View</Link>
                                </Button>
                            </div>
                        )}
                        {pendingContacts > 0 && (
                            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-blue-900 dark:text-blue-100">
                                        New Messages
                                    </p>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        {pendingContacts} pending contact messages
                                    </p>
                                </div>
                                <Button size="sm" variant="ghost" asChild>
                                    <Link href="/admin/messages">View</Link>
                                </Button>
                            </div>
                        )}
                        {lowStock === 0 && outOfStock === 0 && pendingContacts === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No alerts at the moment! 🎉</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                            <Link href="/admin/products/new">
                                <Package className="w-5 h-5" />
                                Add Product
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                            <Link href="/admin/orders">
                                <ShoppingCart className="w-5 h-5" />
                                View Orders
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                            <Link href="/admin/customers">
                                <Users className="w-5 h-5" />
                                View Customers
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-20 flex-col gap-2" asChild>
                            <Link href="/admin/categories">
                                <Package className="w-5 h-5" />
                                Manage Categories
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Revenue Overview */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Revenue Overview</CardTitle>
                        <Tabs value={period} onValueChange={(v: any) => setPeriod(v)}>
                            <TabsList>
                                <TabsTrigger value="7days">7 Days</TabsTrigger>
                                <TabsTrigger value="30days">30 Days</TabsTrigger>
                                <TabsTrigger value="12months">12 Months</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    {salesLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : salesData?.data?.chartData && salesData.data.chartData.length > 0 ? (
                        (() => {
                            const chartData = salesData.data.chartData;
                            const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue));

                            return (
                                <div className="space-y-4">
                                    {/* Simple Chart Display */}
                                    <div className="grid grid-cols-7 gap-2 h-64">
                                        {chartData.slice(0, 7).map((item: any, index: number) => {
                                            const height = (item.revenue / maxRevenue) * 100;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex flex-col items-center justify-end gap-2"
                                                >
                                                    <div className="text-xs text-muted-foreground">
                                                        ${item.revenue.toFixed(0)}
                                                    </div>
                                                    <div
                                                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t"
                                                        style={{ height: `${height}%` }}
                                                    />
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(item.date).toLocaleDateString('en', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                                            <p className="text-2xl font-bold text-green-600">
                                                $
                                                {chartData
                                                    .reduce((sum: number, item: any) => sum + item.revenue, 0)
                                                    .toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Orders</p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {chartData.reduce(
                                                    (sum: number, item: any) => sum + item.orders,
                                                    0
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="h-64 flex items-center justify-center text-muted-foreground">
                            No sales data available
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}