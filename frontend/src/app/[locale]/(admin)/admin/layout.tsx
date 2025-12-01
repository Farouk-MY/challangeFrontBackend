'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Bell,
    Search,
} from 'lucide-react';
import { useMe, useLogout } from '@/lib/react-query/hooks';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';

const menuItems = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
    },
    {
        title: 'Messages',
        href: '/admin/messages',
        icon: MessageSquare,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const { data: userData, isLoading } = useMe();
    const { mutate: logout } = useLogout();

    const user = userData?.data?.user;

    if (isLoading) return <LoadingPage />;

    // Check if user is admin
    if (!user || user.role !== 'ADMIN') {
        router.push('/');
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar - Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 80 }}
                className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 hidden lg:block"
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                        {sidebarOpen ? (
                            <Link href="/admin/dashboard" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-lg">Admin Panel</span>
                            </Link>
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && <span className="font-medium">{item.title}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Toggle Button */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="w-full"
                        >
                            <ChevronLeft
                                className={`w-5 h-5 transition-transform ${
                                    !sidebarOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </Button>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        className="fixed left-0 top-0 h-screen w-80 bg-white dark:bg-slate-900 z-50 lg:hidden overflow-y-auto"
                    >
                        <div className="flex flex-col h-full">
                            <div className="h-16 flex items-center justify-between px-4 border-b">
                                <span className="font-bold text-lg">Admin Panel</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <nav className="flex-1 py-4 px-2 space-y-1">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                                                isActive
                                                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.aside>
                </>
            )}

            {/* Main Content */}
            <div
                className={`lg:ml-${sidebarOpen ? '280' : '80'} transition-all duration-300`}
                style={{ marginLeft: sidebarOpen ? '280px' : '80px' }}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="h-full px-4 flex items-center justify-between gap-4">
                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Search..."
                                    className="pl-10 bg-slate-50 dark:bg-slate-800 border-0"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </Button>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:inline font-medium">{user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/">View Store</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">My Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => logout()}
                                        className="text-red-600 dark:text-red-400"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}