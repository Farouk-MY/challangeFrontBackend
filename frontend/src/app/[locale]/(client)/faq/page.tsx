'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronDown,
    Search,
    ShoppingBag,
    Truck,
    CreditCard,
    Shield,
    HelpCircle,
    MessageSquare,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const faqCategories = [
    {
        id: 'orders',
        name: 'Orders & Shipping',
        icon: Truck,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        faqs: [
            {
                question: 'How long does shipping take?',
                answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery. Free shipping is offered on orders over $50.',
            },
            {
                question: 'How can I track my order?',
                answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order by logging into your account and visiting the Orders page.',
            },
            {
                question: 'Can I change or cancel my order?',
                answer: 'You can cancel or modify your order within 1 hour of placing it. After that, the order enters processing and cannot be changed. Contact support if you need assistance.',
            },
            {
                question: 'Do you ship internationally?',
                answer: 'Yes, we ship to most countries worldwide. International shipping times vary by location, typically 7-14 business days. Customs fees may apply.',
            },
        ],
    },
    {
        id: 'payment',
        name: 'Payment & Pricing',
        icon: CreditCard,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        faqs: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Cash on Delivery for select regions.',
            },
            {
                question: 'Is my payment information secure?',
                answer: 'Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.',
            },
            {
                question: 'Do you offer price matching?',
                answer: 'Yes! If you find a lower price on an identical item from a competitor, we\'ll match it. Contact support with proof of the lower price within 7 days of purchase.',
            },
            {
                question: 'Can I use multiple promo codes?',
                answer: 'Only one promo code can be applied per order. Promo codes cannot be combined with other offers unless specifically stated.',
            },
        ],
    },
    {
        id: 'returns',
        name: 'Returns & Refunds',
        icon: Shield,
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        faqs: [
            {
                question: 'What is your return policy?',
                answer: 'We offer a 30-day money-back guarantee on most items. Products must be unused and in original packaging. Shipping costs for returns are the customer\'s responsibility unless the item is defective.',
            },
            {
                question: 'How do I start a return?',
                answer: 'Log into your account, go to Orders, select the order you want to return, and click "Request Return". Follow the instructions to print your return label.',
            },
            {
                question: 'How long do refunds take?',
                answer: 'Once we receive your return, refunds are processed within 3-5 business days. The refund will be credited to your original payment method.',
            },
            {
                question: 'Can I exchange an item?',
                answer: 'Yes! You can exchange items for different sizes, colors, or styles. Contact support to arrange an exchange instead of a full return.',
            },
        ],
    },
    {
        id: 'account',
        name: 'Account & Support',
        icon: HelpCircle,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        faqs: [
            {
                question: 'How do I create an account?',
                answer: 'Click on "Sign Up" in the top right corner, fill in your details, and verify your email address. You can also create an account during checkout.',
            },
            {
                question: 'I forgot my password. What should I do?',
                answer: 'Click on "Forgot Password" on the login page. Enter your email address and we\'ll send you instructions to reset your password.',
            },
            {
                question: 'How do I update my account information?',
                answer: 'Log into your account and go to Profile Settings. From there you can update your name, email, password, and saved addresses.',
            },
            {
                question: 'How can I contact customer support?',
                answer: 'You can reach our support team via email at support@neonshop.com, phone at +1 (555) 123-4567, or use our contact form. We respond within 24 hours.',
            },
        ],
    },
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    // Filter FAQs based on search
    const filteredCategories = faqCategories.map((category) => ({
        ...category,
        faqs: category.faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((category) => category.faqs.length > 0);

    const toggleFaq = (categoryId: string, faqIndex: number) => {
        const key = `${categoryId}-${faqIndex}`;
        setExpandedFaq(expandedFaq === key ? null : key);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-indigo-100">
                            Find answers to common questions about orders, shipping, payments, and more
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-14 text-lg bg-white dark:bg-slate-900"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Category Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-3 justify-center mb-12"
                >
                    <Button
                        variant={activeCategory === null ? 'default' : 'outline'}
                        onClick={() => setActiveCategory(null)}
                    >
                        All Categories
                    </Button>
                    {faqCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(category.id)}
                            className="gap-2"
                        >
                            <category.icon className="w-4 h-4" />
                            {category.name}
                        </Button>
                    ))}
                </motion.div>

                {/* FAQ Content */}
                <div className="max-w-4xl mx-auto space-y-12">
                    {(searchQuery ? filteredCategories : activeCategory ? faqCategories.filter(c => c.id === activeCategory) : faqCategories).map((category, categoryIndex) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                                    <category.icon className={`w-6 h-6 ${category.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{category.name}</h2>
                                    <Badge variant="outline">{category.faqs.length} questions</Badge>
                                </div>
                            </div>

                            {/* FAQ Items */}
                            <div className="space-y-3">
                                {category.faqs.map((faq, faqIndex) => {
                                    const isExpanded = expandedFaq === `${category.id}-${faqIndex}`;
                                    return (
                                        <Card
                                            key={faqIndex}
                                            className="overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <button
                                                onClick={() => toggleFaq(category.id, faqIndex)}
                                                className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                                            >
                                                <span className="font-semibold text-lg pr-4">
                                                    {faq.question}
                                                </span>
                                                <motion.div
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex-shrink-0"
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </motion.div>
                                            </button>

                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    height: isExpanded ? 'auto' : 0,
                                                    opacity: isExpanded ? 1 : 0,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <CardContent className="px-6 pb-6 pt-0">
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </CardContent>
                                            </motion.div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}

                    {/* No Results */}
                    {searchQuery && filteredCategories.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-bold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-4">
                                Try different keywords or browse all categories
                            </p>
                            <Button variant="outline" onClick={() => setSearchQuery('')}>
                                Clear Search
                            </Button>
                        </motion.div>
                    )}
                </div>

                {/* Contact Support CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-4xl mx-auto mt-16"
                >
                    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white border-0">
                        <CardContent className="p-8 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">
                                Still have questions?
                            </h3>
                            <p className="text-blue-100 mb-6">
                                Can't find what you're looking for? Our support team is here to help.
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => window.location.href = '/contact'}
                            >
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}