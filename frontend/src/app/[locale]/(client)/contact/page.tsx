'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
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
            title: 'Email',
            content: 'support@neonshop.com',
            link: 'mailto:support@neonshop.com',
            gradient: 'from-blue-500 to-indigo-500',
        },
        {
            icon: Phone,
            title: 'Phone',
            content: '+1 (555) 123-4567',
            link: 'tel:+15551234567',
            gradient: 'from-green-500 to-emerald-500',
        },
        {
            icon: MapPin,
            title: 'Address',
            content: '123 Main Street, New York, NY 10001',
            link: 'https://maps.google.com',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            icon: Clock,
            title: 'Working Hours',
            content: 'Mon-Fri: 9AM - 6PM',
            link: null,
            gradient: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-lg text-blue-100">
                            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
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
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5" />
                                        Send us a Message
                                    </CardTitle>
                                    <CardDescription>
                                        Fill out the form below and we'll get back to you within 24 hours
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
                                            <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                            <p className="text-muted-foreground">
                                                Thank you for contacting us. We'll respond soon.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Your Name *</Label>
                                                    <Input
                                                        id="name"
                                                        {...register('name')}
                                                        placeholder="John Doe"
                                                    />
                                                    {errors.name && (
                                                        <p className="text-xs text-red-500">{errors.name.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        {...register('email')}
                                                        placeholder="john@example.com"
                                                    />
                                                    {errors.email && (
                                                        <p className="text-xs text-red-500">{errors.email.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject *</Label>
                                                <Input
                                                    id="subject"
                                                    {...register('subject')}
                                                    placeholder="How can we help you?"
                                                />
                                                {errors.subject && (
                                                    <p className="text-xs text-red-500">{errors.subject.message}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message *</Label>
                                                <Textarea
                                                    id="message"
                                                    {...register('message')}
                                                    placeholder="Tell us more about your inquiry..."
                                                    rows={6}
                                                />
                                                {errors.message && (
                                                    <p className="text-xs text-red-500">{errors.message.message}</p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                size="lg"
                                                className="w-full gradient-primary"
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    'Sending...'
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5 mr-2" />
                                                        Send Message
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
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${info.gradient} flex items-center justify-center flex-shrink-0`}>
                                                <info.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
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
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="overflow-hidden">
                                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                                    <MapPin className="w-12 h-12 text-muted-foreground" />
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-sm text-muted-foreground">
                                        Visit our store or reach out to us using the contact information above.
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
                            <h3 className="text-xl font-bold mb-2">Looking for Quick Answers?</h3>
                            <p className="text-muted-foreground mb-4">
                                Check out our FAQ section for instant answers to common questions
                            </p>
                            <Button variant="outline" onClick={() => window.location.href = '/faq'}>
                                Visit FAQ
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}