'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { Link, usePathname } from '@/i18n/routing';
import { useMe, useLogout } from '@/lib/react-query/hooks';
import { useCart } from '@/lib/react-query/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
    ShoppingBag,
    Search,
    User,
    Heart,
    ShoppingCart,
    Menu,
    X,
    Sun,
    Moon,
    LogOut,
    Package,
    Settings,
    LayoutDashboard,
    Globe,
    Home,
    Grid3x3,
    Info,
    Mail,
    Sparkles,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const isAuthPage = pathname.includes('/login') || pathname.includes('/register') || pathname.includes('/forgot-password');
    const hasTokens = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');

    const { data: userData, isLoading: userLoading } = useMe();
    const { data: cartData } = useCart();
    const { mutate: logout } = useLogout();

    const user = userData?.data?.user;
    const cartItemCount = cartData?.data?.summary?.totalQuantity || 0;

    const navLinks = [
        { href: '/', label: t('nav.home'), icon: Home },
        { href: '/products', label: t('nav.products'), icon: ShoppingBag },
        { href: '/categories', label: t('nav.categories'), icon: Grid3x3 },
        { href: '/about', label: t('nav.about'), icon: Info },
        { href: '/contact', label: t('nav.contact'), icon: Mail },
    ];

    const toggleLanguage = () => {
        const newLocale = locale === 'en' ? 'ar' : 'en';
        window.location.href = `/${newLocale}${pathname}`;
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // In Navbar component, add this useEffect:
    useEffect(() => {
        const handleGuestCartUpdate = () => {
            // Force re-render when guest cart updates
            if (!hasTokens) {
                // Trigger a state update or refetch
                window.location.reload(); // Simple solution
                // Or better: use a state management solution
            }
        };

        window.addEventListener('guest-cart-updated', handleGuestCartUpdate);
        return () => window.removeEventListener('guest-cart-updated', handleGuestCartUpdate);
    }, [hasTokens]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50'
                        : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-transparent'
                }`}
            >
                {/* Top Announcement Bar - Desktop Only */}
                <div className="hidden lg:block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                    <div className="container-custom">
                        <div className="flex items-center justify-between h-9 text-xs font-medium">
                            <div className="flex items-center gap-6">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Free shipping on orders over $50
                                </span>
                                <span className="opacity-80">|</span>
                                <span>Premium quality guaranteed</span>
                            </div>
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Navbar */}
                <div className="container-custom">
                    <div className="flex items-center justify-between h-13 lg:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 lg:gap-3 group relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                    <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6 text-white" strokeWidth={2.5} />
                                </div>
                            </motion.div>
                            <div className="hidden sm:block">
                                <h1 className="text-lg lg:text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    {t('common.appName')}
                                </h1>
                                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-0.5 tracking-wide">PREMIUM SHOPPING</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative px-4 py-2 group"
                                >
                                    <span className={`text-sm font-semibold transition-colors ${
                                        pathname === link.href
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                    }`}>
                                        {link.label}
                                    </span>
                                    {pathname === link.href && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 lg:gap-1.5">
                            {/* Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(true)}
                                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                <Search className="w-5 h-5" />
                            </Button>

                            {/* Language - Mobile */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleLanguage}
                                className="lg:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                <Globe className="w-5 h-5" />
                            </Button>

                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>

                            {/* Wishlist */}
                            {user && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="hidden sm:flex rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                >
                                    <Link href="/wishlist">
                                        <Heart className="w-5 h-5" />
                                    </Link>
                                </Button>
                            )}

                            {/* Cart */}
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                                <Link href="/cart">
                                    <ShoppingCart className="w-5 h-5" />
                                    <AnimatePresence>
                                        {cartItemCount > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
                                            >
                                                {cartItemCount > 99 ? '99+' : cartItemCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </Button>

                            {/* User Menu */}
                            {userLoading ? (
                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            ) : user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative rounded-full p-1 h-auto hover:bg-slate-100 dark:hover:bg-slate-800">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-slate-200 dark:ring-slate-700">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-950" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64">
                                        <DropdownMenuLabel>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                                                    user.avatar ? '' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                }`}>
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {user.role === 'ADMIN' && (
                                            <>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/admin/dashboard" className="cursor-pointer font-medium">
                                                        <LayoutDashboard className="w-4 h-4 mr-3" />
                                                        {t('nav.admin')}
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer font-medium">
                                                <User className="w-4 h-4 mr-3" />
                                                {t('nav.profile')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/orders" className="cursor-pointer font-medium">
                                                <Package className="w-4 h-4 mr-3" />
                                                {t('nav.orders')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/wishlist" className="cursor-pointer font-medium">
                                                <Heart className="w-4 h-4 mr-3" />
                                                {t('nav.wishlist')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile/settings" className="cursor-pointer font-medium">
                                                <Settings className="w-4 h-4 mr-3" />
                                                {t('common.settings')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => logout()}
                                            className="text-red-600 dark:text-red-400 cursor-pointer font-medium"
                                        >
                                            <LogOut className="w-4 h-4 mr-3" />
                                            {t('nav.logout')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="hidden sm:flex items-center gap-2">
                                    <Button variant="ghost" size="sm" asChild className="rounded-full font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <Link href="/login">{t('nav.login')}</Link>
                                    </Button>
                                    <Button size="sm" asChild className="rounded-full font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all">
                                        <Link href="/register">{t('nav.register')}</Link>
                                    </Button>
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-2xl z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
                            >
                                <div className="container-custom py-6 space-y-6">
                                    {/* Navigation Links */}
                                    <nav className="space-y-1">
                                        {navLinks.map((link, index) => {
                                            const Icon = link.icon;
                                            const isActive = pathname === link.href;
                                            return (
                                                <motion.div
                                                    key={link.href}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <Link
                                                        href={link.href}
                                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-base transition-all ${
                                                            isActive
                                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                        }`}
                                                    >
                                                        <Icon className="w-5 h-5" />
                                                        <span>{link.label}</span>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </nav>

                                    {/* Auth Buttons */}
                                    {!user && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="pt-4 space-y-3 border-t border-slate-200 dark:border-slate-800"
                                        >
                                            <Button variant="outline" size="lg" className="w-full rounded-xl font-semibold text-base h-12" asChild>
                                                <Link href="/login">
                                                    <User className="w-5 h-5 mr-2" />
                                                    {t('nav.login')}
                                                </Link>
                                            </Button>
                                            <Button size="lg" className="w-full rounded-xl font-semibold text-base h-12 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg" asChild>
                                                <Link href="/register">
                                                    <Sparkles className="w-5 h-5 mr-2" />
                                                    {t('nav.register')}
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* User Info - Mobile */}
                                    {user && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25 }}
                                            className="pt-4 border-t border-slate-200 dark:border-slate-800"
                                        >
                                            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold ring-2 ring-white dark:ring-slate-700">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Spacer height matches navbar height */}
            <div className="h-16 lg:h-[69px]" />

            {/* Search Modal */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-lg flex items-start justify-center p-4 pt-24 overflow-y-auto"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -50, opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="w-full max-w-2xl bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                    <Search className="w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search for products..."
                                        className="flex-1 bg-transparent border-none outline-none text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center">
                                    <Search className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Search Coming Soon</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">We're working on powerful search features for you!</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}