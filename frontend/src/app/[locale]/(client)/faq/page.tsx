'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
    ChevronDown,
    Search,
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

export default function FAQPage() {
    const t = useTranslations();
    const locale = useLocale();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

    const faqCategories = [
        {
            id: 'orders',
            name: t('faq.categories.orders.name'),
            icon: Truck,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            faqs: [
                {
                    question: t('faq.categories.orders.faqs.shippingTime.question'),
                    answer: t('faq.categories.orders.faqs.shippingTime.answer'),
                },
                {
                    question: t('faq.categories.orders.faqs.trackOrder.question'),
                    answer: t('faq.categories.orders.faqs.trackOrder.answer'),
                },
                {
                    question: t('faq.categories.orders.faqs.changeOrder.question'),
                    answer: t('faq.categories.orders.faqs.changeOrder.answer'),
                },
                {
                    question: t('faq.categories.orders.faqs.international.question'),
                    answer: t('faq.categories.orders.faqs.international.answer'),
                },
            ],
        },
        {
            id: 'payment',
            name: t('faq.categories.payment.name'),
            icon: CreditCard,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            faqs: [
                {
                    question: t('faq.categories.payment.faqs.paymentMethods.question'),
                    answer: t('faq.categories.payment.faqs.paymentMethods.answer'),
                },
                {
                    question: t('faq.categories.payment.faqs.security.question'),
                    answer: t('faq.categories.payment.faqs.security.answer'),
                },
                {
                    question: t('faq.categories.payment.faqs.priceMatch.question'),
                    answer: t('faq.categories.payment.faqs.priceMatch.answer'),
                },
                {
                    question: t('faq.categories.payment.faqs.promoCodes.question'),
                    answer: t('faq.categories.payment.faqs.promoCodes.answer'),
                },
            ],
        },
        {
            id: 'returns',
            name: t('faq.categories.returns.name'),
            icon: Shield,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            faqs: [
                {
                    question: t('faq.categories.returns.faqs.returnPolicy.question'),
                    answer: t('faq.categories.returns.faqs.returnPolicy.answer'),
                },
                {
                    question: t('faq.categories.returns.faqs.startReturn.question'),
                    answer: t('faq.categories.returns.faqs.startReturn.answer'),
                },
                {
                    question: t('faq.categories.returns.faqs.refundTime.question'),
                    answer: t('faq.categories.returns.faqs.refundTime.answer'),
                },
                {
                    question: t('faq.categories.returns.faqs.exchange.question'),
                    answer: t('faq.categories.returns.faqs.exchange.answer'),
                },
            ],
        },
        {
            id: 'account',
            name: t('faq.categories.account.name'),
            icon: HelpCircle,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            faqs: [
                {
                    question: t('faq.categories.account.faqs.createAccount.question'),
                    answer: t('faq.categories.account.faqs.createAccount.answer'),
                },
                {
                    question: t('faq.categories.account.faqs.forgotPassword.question'),
                    answer: t('faq.categories.account.faqs.forgotPassword.answer'),
                },
                {
                    question: t('faq.categories.account.faqs.updateInfo.question'),
                    answer: t('faq.categories.account.faqs.updateInfo.answer'),
                },
                {
                    question: t('faq.categories.account.faqs.contactSupport.question'),
                    answer: t('faq.categories.account.faqs.contactSupport.answer'),
                },
            ],
        },
    ];

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
        <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold">
                            {t('faq.title')}
                        </h1>
                        <p className="text-lg text-indigo-100">
                            {t('faq.subtitle')}
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className={`absolute ${locale === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
                            <Input
                                placeholder={t('faq.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${locale === 'ar' ? 'pr-12' : 'pl-12'} h-14 text-lg bg-white dark:bg-slate-900`}
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
                        {t('faq.allCategories')}
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
                            <div className={`flex items-center gap-3 mb-6 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-12 h-12 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                                    <category.icon className={`w-6 h-6 ${category.color}`} />
                                </div>
                                <div className={locale === 'ar' ? 'text-right' : ''}>
                                    <h2 className="text-2xl font-bold">{category.name}</h2>
                                    <Badge variant="outline">{category.faqs.length} {t('faq.questions')}</Badge>
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
                                                className={`w-full text-${locale === 'ar' ? 'right' : 'left'} p-6 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors`}
                                            >
                                                <span className={`font-semibold text-lg ${locale === 'ar' ? 'pl-4' : 'pr-4'}`}>
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
                                                    <p className={`text-muted-foreground leading-relaxed ${locale === 'ar' ? 'text-right' : ''}`}>
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
                            <h3 className="text-xl font-bold mb-2">{t('faq.noResults')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {t('faq.noResultsDescription')}
                            </p>
                            <Button variant="outline" onClick={() => setSearchQuery('')}>
                                {t('faq.clearSearch')}
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
                                {t('faq.stillHaveQuestions')}
                            </h3>
                            <p className="text-blue-100 mb-6">
                                {t('faq.stillHaveQuestionsDesc')}
                            </p>
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={() => window.location.href = `/${locale}/contact`}
                            >
                                {t('faq.contactSupport')}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}