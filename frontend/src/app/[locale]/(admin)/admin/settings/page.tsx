'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Store, Truck, Mail, CreditCard, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    // Site Settings State
    const [siteName, setSiteName] = useState('NeonShop');
    const [siteDescription, setSiteDescription] = useState('Your one-stop shop for amazing products');
    const [siteEmail, setSiteEmail] = useState('info@neonshop.com');
    const [sitePhone, setSitePhone] = useState('+1 234 567 890');

    // Shipping Settings
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('100');
    const [standardShippingFee, setStandardShippingFee] = useState('10');
    const [expressShippingFee, setExpressShippingFee] = useState('25');

    // Payment Settings
    const [cashOnDeliveryEnabled, setCashOnDeliveryEnabled] = useState(true);
    const [stripeEnabled, setStripeEnabled] = useState(false);
    const [paypalEnabled, setPaypalEnabled] = useState(false);

    // Email Settings
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
    const [orderConfirmationEnabled, setOrderConfirmationEnabled] = useState(true);
    const [shippingUpdatesEnabled, setShippingUpdatesEnabled] = useState(true);

    // Store Settings
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
    const [requireEmailVerification, setRequireEmailVerification] = useState(false);

    const handleSaveSettings = (section: string) => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            toast.success(`${section} settings saved successfully!`);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Configure your store settings and preferences
                </p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                    <TabsTrigger value="general">
                        <Store className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="shipping">
                        <Truck className="w-4 h-4 mr-2" />
                        Shipping
                    </TabsTrigger>
                    <TabsTrigger value="payment">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Payment
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="store">
                        <Globe className="w-4 h-4 mr-2" />
                        Store
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Information</CardTitle>
                            <CardDescription>
                                Basic information about your store
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input
                                    id="siteName"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <Textarea
                                    id="siteDescription"
                                    value={siteDescription}
                                    onChange={(e) => setSiteDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="siteEmail">Contact Email</Label>
                                    <Input
                                        id="siteEmail"
                                        type="email"
                                        value={siteEmail}
                                        onChange={(e) => setSiteEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sitePhone">Contact Phone</Label>
                                    <Input
                                        id="sitePhone"
                                        value={sitePhone}
                                        onChange={(e) => setSitePhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <Button
                                onClick={() => handleSaveSettings('General')}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Shipping Settings */}
                <TabsContent value="shipping" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Configuration</CardTitle>
                            <CardDescription>
                                Configure shipping methods and fees
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="freeShipping">
                                    Free Shipping Threshold ($)
                                </Label>
                                <Input
                                    id="freeShipping"
                                    type="number"
                                    value={freeShippingThreshold}
                                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Orders above this amount get free shipping
                                </p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="standardShipping">
                                        Standard Shipping Fee ($)
                                    </Label>
                                    <Input
                                        id="standardShipping"
                                        type="number"
                                        value={standardShippingFee}
                                        onChange={(e) => setStandardShippingFee(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expressShipping">
                                        Express Shipping Fee ($)
                                    </Label>
                                    <Input
                                        id="expressShipping"
                                        type="number"
                                        value={expressShippingFee}
                                        onChange={(e) => setExpressShippingFee(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <Button
                                onClick={() => handleSaveSettings('Shipping')}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Settings */}
                <TabsContent value="payment" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>
                                Enable or disable payment methods
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Cash on Delivery</p>
                                    <p className="text-sm text-muted-foreground">
                                        Accept cash payments on delivery
                                    </p>
                                </div>
                                <Switch
                                    checked={cashOnDeliveryEnabled}
                                    onCheckedChange={setCashOnDeliveryEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Stripe Payment</p>
                                    <p className="text-sm text-muted-foreground">
                                        Accept credit card payments via Stripe
                                    </p>
                                </div>
                                <Switch
                                    checked={stripeEnabled}
                                    onCheckedChange={setStripeEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">PayPal</p>
                                    <p className="text-sm text-muted-foreground">
                                        Accept PayPal payments
                                    </p>
                                </div>
                                <Switch
                                    checked={paypalEnabled}
                                    onCheckedChange={setPaypalEnabled}
                                />
                            </div>

                            <Separator />

                            <Button
                                onClick={() => handleSaveSettings('Payment')}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Configure email notification preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-muted-foreground">
                                        Enable all email notifications
                                    </p>
                                </div>
                                <Switch
                                    checked={emailNotificationsEnabled}
                                    onCheckedChange={setEmailNotificationsEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Order Confirmation</p>
                                    <p className="text-sm text-muted-foreground">
                                        Send order confirmation emails
                                    </p>
                                </div>
                                <Switch
                                    checked={orderConfirmationEnabled}
                                    onCheckedChange={setOrderConfirmationEnabled}
                                    disabled={!emailNotificationsEnabled}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Shipping Updates</p>
                                    <p className="text-sm text-muted-foreground">
                                        Send shipping status update emails
                                    </p>
                                </div>
                                <Switch
                                    checked={shippingUpdatesEnabled}
                                    onCheckedChange={setShippingUpdatesEnabled}
                                    disabled={!emailNotificationsEnabled}
                                />
                            </div>

                            <Separator />

                            <Button
                                onClick={() => handleSaveSettings('Email')}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Store Settings */}
                <TabsContent value="store" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Configuration</CardTitle>
                            <CardDescription>
                                Configure store behavior and features
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                                <div>
                                    <p className="font-medium text-orange-900 dark:text-orange-100">
                                        Maintenance Mode
                                    </p>
                                    <p className="text-sm text-orange-700 dark:text-orange-300">
                                        Temporarily disable the store for maintenance
                                    </p>
                                </div>
                                <Switch
                                    checked={maintenanceMode}
                                    onCheckedChange={setMaintenanceMode}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Guest Checkout</p>
                                    <p className="text-sm text-muted-foreground">
                                        Allow users to checkout without creating an account
                                    </p>
                                </div>
                                <Switch
                                    checked={allowGuestCheckout}
                                    onCheckedChange={setAllowGuestCheckout}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <p className="font-medium">Email Verification Required</p>
                                    <p className="text-sm text-muted-foreground">
                                        Require users to verify email before ordering
                                    </p>
                                </div>
                                <Switch
                                    checked={requireEmailVerification}
                                    onCheckedChange={setRequireEmailVerification}
                                />
                            </div>

                            <Separator />

                            <Button
                                onClick={() => handleSaveSettings('Store')}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}