'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
    const t = useTranslations();
    const locale = useLocale();
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const { mutate: submitContact, isPending } = useMutation({
        mutationFn: contactApi.submit,
        onSuccess: () => {
            setSubmitted(true);
            reset();
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setTimeout(() => setSubmitted(false), 5000);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send message');
        },
    });

    const onSubmit = (data: ContactFormData) => {
        submitContact(data);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: t('contact.info.email.title'),
            content: t('contact.info.email.content'),
            link: 'mailto:support@neonshop.com',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            icon: Phone,
            title: t('contact.info.phone.title'),
            content: t('contact.info.phone.content'),
            link: 'tel:+15551234567',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            icon: MapPin,
            title: t('contact.info.address.title'),
            content: t('contact.info.address.content'),
            link: 'https://maps.google.com',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Clock,
            title: t('contact.info.hours.title'),
            content: t('contact.info.hours.content'),
            link: null,
            gradient: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-background" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 text-white py-20 lg:py-28 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className={`absolute top-20 ${locale === 'ar' ? 'left-10' : 'right-10'} w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse`} />
                    <div className={`absolute bottom-20 ${locale === 'ar' ? 'right-20' : 'left-20'} w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-700`} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-3xl" />
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center space-y-6"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">{locale === 'ar' ? 'نحن هنا للمساعدة' : 'We\'re Here to Help'}</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            {t('contact.title')}
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            {t('contact.subtitle')}
                        </p>
                    </motion.div>
                </div>
            </div>


            <div className="container-custom py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className={`flex items-center gap-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                                        <MessageSquare className="w-5 h-5" />
                                        {t('contact.form.title')}
                                    </CardTitle>
                                    <CardDescription className={locale === 'ar' ? 'text-right' : ''}>
                                        {t('contact.form.subtitle')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {submitted ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-center py-12"
                                        >
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{t('contact.success.title')}</h3>
                                            <p className="text-muted-foreground">
                                                {t('contact.success.description')}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className={locale === 'ar' ? 'text-right block' : ''}>
                                                        {t('contact.form.name')} {t('contact.form.required')}
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        {...register('name')}
                                                        placeholder={t('contact.form.namePlaceholder')}
                                                        className={locale === 'ar' ? 'text-right' : ''}
                                                    />
                                                    {errors.name && (
                                                        <p className={`text-xs text-red-500 ${locale === 'ar' ? 'text-right' : ''}`}>{errors.name.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className={locale === 'ar' ? 'text-right block' : ''}>
                                                        {t('contact.form.email')} {t('contact.form.required')}
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        {...register('email')}
                                                        placeholder={t('contact.form.emailPlaceholder')}
                                                        className={locale === 'ar' ? 'text-right' : ''}
                                                    />
                                                    {errors.email && (
                                                        <p className={`text-xs text-red-500 ${locale === 'ar' ? 'text-right' : ''}`}>{errors.email.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject" className={locale === 'ar' ? 'text-right block' : ''}>
                                                    {t('contact.form.subject')} {t('contact.form.required')}
                                                </Label>
                                                <Input
                                                    id="subject"
                                                    {...register('subject')}
                                                    placeholder={t('contact.form.subjectPlaceholder')}
                                                    className={locale === 'ar' ? 'text-right' : ''}
                                                />
                                                {errors.subject && (
                                                    <p className={`text-xs text-red-500 ${locale === 'ar' ? 'text-right' : ''}`}>{errors.subject.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className={locale === 'ar' ? 'text-right block' : ''}>
                                                    {t('contact.form.message')} {t('contact.form.required')}
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    {...register('message')}
                                                    placeholder={t('contact.form.messagePlaceholder')}
                                                    rows={6}
                                                    className={locale === 'ar' ? 'text-right' : ''}
                                                />
                                                {errors.message && (
                                                    <p className={`text-xs text-red-500 ${locale === 'ar' ? 'text-right' : ''}`}>{errors.message.message}</p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full gradient-primary"
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    t('contact.form.sending')
                                                ) : (
                                                    <>
                                                        <Send className={`w-5 h-5 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} />
                                                        {t('contact.form.send')}
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="space-y-6">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className={`flex items-start gap-4 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0`}>
                                                <info.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className={`flex-1 ${locale === 'ar' ? 'text-right' : ''}`}>
                                                <h3 className="font-semibold mb-1">{info.title}</h3>
                                                {info.link ? (
                                                    <a
                                                        href={info.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {info.content}
                                                    </a>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">{info.content}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}

                        {/* Map Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="overflow-hidden">
                                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                    <MapPin className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <CardContent className="p-4">
                                    <p className={`text-sm text-muted-foreground ${locale === 'ar' ? 'text-right' : ''}`}>
                                        {t('contact.map.description')}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* FAQ Quick Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <Card>
                        <CardContent className="p-8">
                            <h3 className="text-xl font-bold mb-2">{t('contact.faqSection.title')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {t('contact.faqSection.description')}
                            </p>
                            <Button variant="outline" onClick={() => window.location.href = `/${locale}/faq`}>
                                {t('contact.faqSection.visitFaq')}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}