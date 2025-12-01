'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
    ShoppingBag,
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Send,
    Heart,
    ArrowRight,
    Sparkles,
    Shield,
    Truck,
    Headphones,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function Footer() {
    const t = useTranslations();
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const footerLinks = {
        shop: [
            { href: '/products', label: t('nav.products') },
            { href: '/categories', label: t('nav.categories') },
            { href: '/products?featured=true', label: t('products.featured') },
            { href: '/products?sort=newest', label: t('products.newArrivals') },
        ],
        customer: [
            { href: '/profile', label: t('nav.profile') },
            { href: '/orders', label: t('nav.orders') },
            { href: '/wishlist', label: t('nav.wishlist') },
            { href: '/cart', label: t('nav.cart') },
        ],
        company: [
            { href: '/about', label: t('nav.about') },
            { href: '/contact', label: t('nav.contact') },
            { href: '/faq', label: t('nav.faq') },
            { href: '/terms', label: t('footer.termsOfService') },
            { href: '/privacy', label: t('footer.privacyPolicy') },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook', gradient: 'from-blue-600 to-blue-700' },
        { icon: Twitter, href: '#', label: 'Twitter', gradient: 'from-sky-500 to-sky-600' },
        { icon: Instagram, href: '#', label: 'Instagram', gradient: 'from-pink-600 to-purple-600' },
        { icon: Youtube, href: '#', label: 'YouTube', gradient: 'from-red-600 to-red-700' },
    ];

    const features = [
        { icon: Truck, title: 'Fast Delivery', desc: 'Within 2-3 days' },
        { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
        { icon: Headphones, title: '24/7 Support', desc: 'Always here' },
    ];

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setTimeout(() => {
                setSubscribed(false);
                setEmail('');
            }, 3000);
        }
    };

    return (
        <footer className="relative mt-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

            <div className="relative">
                {/* Feature Bar */}
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <div className="container-custom py-8 lg:py-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{feature.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{feature.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-b border-slate-200 dark:border-slate-800">
                    <div className="container-custom py-12 lg:py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 lg:p-12 shadow-2xl"
                        >
                            {/* Decorative Background */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -mr-48 -mt-48" />
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -ml-48 -mb-48" />
                            </div>

                            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                                <div className="text-white">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm mb-4">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Newsletter</span>
                                    </div>
                                    <h3 className="text-3xl lg:text-4xl font-black mb-3 leading-tight">
                                        Join Our Community!
                                    </h3>
                                    <p className="text-blue-50 text-base lg:text-lg font-medium">
                                        Get exclusive deals, early access to sales, and special offers straight to your inbox.
                                    </p>
                                </div>

                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <Input
                                                type="email"
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-12 h-14 bg-white dark:bg-slate-900 border-0 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 font-medium shadow-lg"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="h-14 px-8 bg-white hover:bg-slate-50 text-blue-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {subscribed ? (
                                                <>
                                                    <Check className="w-5 h-5 mr-2" />
                                                    Subscribed!
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5 mr-2" />
                                                    Subscribe
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-blue-100 font-medium">
                                        🎁 Get 10% off your first order when you subscribe!
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container-custom py-12 lg:py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-4 space-y-6">
                            <Link href="/" className="inline-flex items-center gap-3 group">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity" />
                                    <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                                        <ShoppingBag className="w-6 h-6 text-white" />
                                    </div>
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                                        {t('common.appName')}
                                    </h2>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">PREMIUM SHOPPING</p>
                                </div>
                            </Link>

                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                Your trusted destination for premium products. Quality, affordability, and exceptional service in one place.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                {[
                                    { icon: Mail, text: 'support@neonshop.com', href: 'mailto:support@neonshop.com' },
                                    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                                    { icon: MapPin, text: '123 Shopping St, NY 10001', href: '#' },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.a
                                            key={index}
                                            href={item.href}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 flex items-center justify-center transition-colors">
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span>{item.text}</span>
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Shop Links */}
                        <div className="lg:col-span-2 space-y-5">
                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                {t('nav.shop')}
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Links */}
                        <div className="lg:col-span-2 space-y-5">
                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                Customer
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.customer.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div className="lg:col-span-2 space-y-5">
                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                Company
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Social & Trust */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                    Follow Us
                                </h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {socialLinks.map((social) => {
                                        const Icon = social.icon;
                                        return (
                                            <motion.a
                                                key={social.label}
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br ${social.gradient} text-white shadow-lg hover:shadow-xl transition-all`}
                                                aria-label={social.label}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                                    We Accept
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['VISA', 'MC', 'AMEX', 'PayPal'].map((method) => (
                                        <div
                                            key={method}
                                            className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-black text-slate-700 dark:text-slate-300"
                                        >
                                            {method}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="container-custom py-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                            <p className="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-400">
                                {t('footer.copyright')}
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:flex items-center gap-1.5">
                                    Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for you
                                </span>
                            </p>

                            <div className="flex items-center gap-6 text-xs font-bold text-slate-500 dark:text-slate-400">
                                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Terms
                                </Link>
                                <span>•</span>
                                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Privacy
                                </Link>
                                <span>•</span>
                                <Link href="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    Cookies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}