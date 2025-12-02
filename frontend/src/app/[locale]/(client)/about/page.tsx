'use client';

import { motion } from 'framer-motion';
import {
    Heart,
    Users,
    Target,
    Award,
    TrendingUp,
    ShoppingBag,
    Shield,
    Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
    const stats = [
        { label: 'Happy Customers', value: '10,000+', icon: Users },
        { label: 'Products', value: '500+', icon: ShoppingBag },
        { label: 'Years in Business', value: '5+', icon: Award },
        { label: 'Customer Satisfaction', value: '98%', icon: TrendingUp },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Customer First',
            description: 'Our customers are at the heart of everything we do. We strive to exceed expectations with every interaction.',
            gradient: 'from-red-500 to-pink-500',
        },
        {
            icon: Shield,
            title: 'Quality Guaranteed',
            description: 'We carefully curate our products to ensure only the highest quality items make it to our store.',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            icon: Target,
            title: 'Innovation',
            description: 'We constantly evolve to bring you the latest products and the best shopping experience.',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            icon: Sparkles,
            title: 'Sustainability',
            description: 'Were committed to sustainable practices and partnering with eco-conscious brands.',
            gradient: 'from-purple-500 to-pink-500',
        },
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        },
        {
            name: 'Michael Chen',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        },
        {
            name: 'Emily Rodriguez',
            role: 'Customer Experience Lead',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
        },
        {
            name: 'David Kim',
            role: 'Product Manager',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-20 lg:py-32 overflow-hidden">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <Badge className="bg-white/20 text-white border-0">
                                Est. 2019
                            </Badge>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Welcome to NeonShop
                            </h1>
                            <p className="text-lg text-blue-100 leading-relaxed">
                                We're passionate about bringing you the best products at unbeatable prices.
                                Our mission is to make online shopping easy, enjoyable, and accessible to everyone.
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => window.location.href = '/products'}
                            >
                                Shop Now
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                                    alt="About Us"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-40 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-slate-50 dark:bg-slate-950 border-y">
                <div className="container-custom">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="prose dark:prose-invert max-w-none"
                        >
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                Founded in 2019, NeonShop started with a simple idea: make quality products
                                accessible to everyone. What began as a small online store has grown into a
                                thriving community of happy customers across the country.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                We believe that shopping should be more than just a transaction. It should be
                                an experience that brings joy, convenience, and value to your life. That's why
                                we carefully curate every product in our catalog and provide exceptional
                                customer service at every step.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Today, we're proud to serve thousands of customers and continue to expand our
                                product range while staying true to our core values: quality, affordability,
                                and customer satisfaction.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="section-padding bg-slate-50 dark:bg-slate-950">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            These principles guide everything we do and help us deliver the best experience to our customers
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4`}>
                                            <value.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                        <p className="text-muted-foreground">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            The passionate people behind NeonShop
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="relative mb-4 group">
                                    <div className="aspect-square rounded-2xl overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Join the NeonShop Family
                        </h2>
                        <p className="text-lg text-blue-100">
                            Start shopping today and experience the difference of quality service and products
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => window.location.href = '/products'}
                            >
                                Browse Products
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                                onClick={() => window.location.href = '/contact'}
                            >
                                Contact Us
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}