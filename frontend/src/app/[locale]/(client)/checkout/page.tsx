'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    MapPin,
    CreditCard,
    CheckCircle2,
    ArrowLeft,
    ArrowRight,
    Lock,
    Package,
    Truck,
    ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/lib/react-query/hooks/useCart';
import { useCreateOrder } from '@/lib/react-query/hooks/useOrders';
import { useAddresses } from '@/lib/react-query/hooks/useUsers';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Validation schemas
const shippingSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(8, 'Valid phone number is required'),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    zipCode: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const steps = [
    { id: 1, name: 'Shipping', icon: MapPin },
    { id: 2, name: 'Payment', icon: CreditCard },
    { id: 3, name: 'Review', icon: CheckCircle2 },
];

export default function CheckoutPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [useNewAddress, setUseNewAddress] = useState(false);

    // Queries
    const { data: cartData, isLoading: cartLoading } = useCart();
    const { data: addressesData } = useAddresses();
    const { mutate: createOrder, isPending: creatingOrder } = useCreateOrder();

    // Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
    });

    const cart = cartData?.data?.cart;
    const summary = cartData?.data?.summary;
    const addresses = addressesData?.data?.addresses || [];

    if (cartLoading) return <LoadingPage />;

    if (!cart || cart.items.length === 0) {
        router.push('/cart');
        return null;
    }

    const subtotal = parseFloat(summary?.subtotal || '0');
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    const handleNextStep = () => {
        if (currentStep === 1) {
            // Validate shipping info
            if (!useNewAddress && !selectedAddressId && addresses.length > 0) {
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setCurrentStep(3);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = (data: ShippingFormData) => {
        // Use selected address or new address
        const shippingAddress = useNewAddress || addresses.length === 0
            ? data
            : addresses.find(a => a.id === selectedAddressId);

        if (!shippingAddress) return;

        createOrder({
            shippingAddress,
            paymentMethod,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white py-8">
                <div className="container-custom">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
                            <p className="text-green-100 flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                Your information is safe with us
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={() => router.push('/cart')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Cart
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white dark:bg-slate-900 border-b">
                <div className="container-custom py-6">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center flex-1">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: currentStep === step.id ? 1.1 : 1,
                                            backgroundColor:
                                                currentStep >= step.id
                                                    ? 'rgb(34, 197, 94)'
                                                    : 'rgb(226, 232, 240)',
                                        }}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            currentStep >= step.id
                                                ? 'text-white'
                                                : 'text-slate-400 dark:text-slate-600'
                                        }`}
                                    >
                                        <step.icon className="w-6 h-6" />
                                    </motion.div>
                                    <p
                                        className={`text-sm font-medium mt-2 ${
                                            currentStep >= step.id
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {step.name}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-1 mx-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: currentStep > step.id ? '100%' : '0%',
                                            }}
                                            transition={{ duration: 0.3 }}
                                            className="h-full bg-green-500"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container-custom py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Shipping */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <MapPin className="w-5 h-5" />
                                                Shipping Address
                                            </CardTitle>
                                            <CardDescription>
                                                Where should we deliver your order?
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Saved Addresses */}
                                            {addresses.length > 0 && (
                                                <div className="space-y-3">
                                                    <Label>Saved Addresses</Label>
                                                    <RadioGroup
                                                        value={selectedAddressId || ''}
                                                        onValueChange={(value) => {
                                                            setSelectedAddressId(value);
                                                            setUseNewAddress(false);
                                                        }}
                                                    >
                                                        {addresses.map((address) => (
                                                            <div
                                                                key={address.id}
                                                                className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                                                            >
                                                                <RadioGroupItem value={address.id} />
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{address.name}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {address.street}, {address.city}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {address.country} {address.zipCode}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        📞 {address.phone}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>

                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setUseNewAddress(true);
                                                            setSelectedAddressId(null);
                                                        }}
                                                        className="w-full"
                                                    >
                                                        + Add New Address
                                                    </Button>
                                                </div>
                                            )}

                                            {/* New Address Form */}
                                            {(useNewAddress || addresses.length === 0) && (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name">Full Name *</Label>
                                                            <Input
                                                                id="name"
                                                                {...register('name')}
                                                                placeholder="John Doe"
                                                            />
                                                            {errors.name && (
                                                                <p className="text-xs text-red-500">
                                                                    {errors.name.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone">Phone *</Label>
                                                            <Input
                                                                id="phone"
                                                                {...register('phone')}
                                                                placeholder="+1 234 567 8900"
                                                            />
                                                            {errors.phone && (
                                                                <p className="text-xs text-red-500">
                                                                    {errors.phone.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="street">Street Address *</Label>
                                                        <Input
                                                            id="street"
                                                            {...register('street')}
                                                            placeholder="123 Main Street"
                                                        />
                                                        {errors.street && (
                                                            <p className="text-xs text-red-500">
                                                                {errors.street.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="city">City *</Label>
                                                            <Input
                                                                id="city"
                                                                {...register('city')}
                                                                placeholder="New York"
                                                            />
                                                            {errors.city && (
                                                                <p className="text-xs text-red-500">
                                                                    {errors.city.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="state">State</Label>
                                                            <Input
                                                                id="state"
                                                                {...register('state')}
                                                                placeholder="NY"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="country">Country *</Label>
                                                            <Input
                                                                id="country"
                                                                {...register('country')}
                                                                placeholder="United States"
                                                            />
                                                            {errors.country && (
                                                                <p className="text-xs text-red-500">
                                                                    {errors.country.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="zipCode">Zip Code</Label>
                                                            <Input
                                                                id="zipCode"
                                                                {...register('zipCode')}
                                                                placeholder="10001"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 2: Payment */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5" />
                                                Payment Method
                                            </CardTitle>
                                            <CardDescription>
                                                Choose your preferred payment method
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <RadioGroup
                                                value={paymentMethod}
                                                onValueChange={setPaymentMethod}
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                                    <RadioGroupItem value="cash_on_delivery" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">Cash on Delivery</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Pay when you receive your order
                                                        </p>
                                                    </div>
                                                    <Package className="w-8 h-8 text-green-600" />
                                                </div>

                                                <div className="flex items-center space-x-3 border rounded-lg p-4 opacity-50 cursor-not-allowed">
                                                    <RadioGroupItem value="credit_card" disabled />
                                                    <div className="flex-1">
                                                        <p className="font-medium">Credit Card</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Coming soon
                                                        </p>
                                                    </div>
                                                    <CreditCard className="w-8 h-8" />
                                                </div>

                                                <div className="flex items-center space-x-3 border rounded-lg p-4 opacity-50 cursor-not-allowed">
                                                    <RadioGroupItem value="paypal" disabled />
                                                    <div className="flex-1">
                                                        <p className="font-medium">PayPal</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Coming soon
                                                        </p>
                                                    </div>
                                                </div>
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {/* Step 3: Review */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" />
                                                Review Your Order
                                            </CardTitle>
                                            <CardDescription>
                                                Please review before placing your order
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Shipping Address Review */}
                                            <div>
                                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    Shipping Address
                                                </h3>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    {selectedAddressId ? (
                                                        (() => {
                                                            const addr = addresses.find(a => a.id === selectedAddressId);
                                                            return addr ? (
                                                                <>
                                                                    <p className="font-medium">{addr.name}</p>
                                                                    <p className="text-sm">{addr.street}</p>
                                                                    <p className="text-sm">
                                                                        {addr.city}, {addr.state} {addr.zipCode}
                                                                    </p>
                                                                    <p className="text-sm">{addr.country}</p>
                                                                    <p className="text-sm">📞 {addr.phone}</p>
                                                                </>
                                                            ) : null;
                                                        })()
                                                    ) : (
                                                        <>
                                                            <p className="font-medium">{getValues('name')}</p>
                                                            <p className="text-sm">{getValues('street')}</p>
                                                            <p className="text-sm">
                                                                {getValues('city')}, {getValues('state')}{' '}
                                                                {getValues('zipCode')}
                                                            </p>
                                                            <p className="text-sm">{getValues('country')}</p>
                                                            <p className="text-sm">📞 {getValues('phone')}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Payment Method Review */}
                                            <div>
                                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    Payment Method
                                                </h3>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <p className="font-medium">Cash on Delivery</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Pay when you receive your order
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Items Review */}
                                            <div>
                                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4" />
                                                    Order Items ({cart.items.length})
                                                </h3>
                                                <div className="space-y-2">
                                                    {cart.items.map((item:any) => {
                                                        const productName =
                                                            locale === 'ar' && item.product.nameAr
                                                                ? item.product.nameAr
                                                                : item.product.name;
                                                        return (
                                                            <div
                                                                key={item.id}
                                                                className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                                                            >
                                                                <img
                                                                    src={item.product.images[0]}
                                                                    alt={productName}
                                                                    className="w-16 h-16 rounded object-cover"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{productName}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Qty: {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <p className="font-semibold">
                                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={handlePreviousStep}
                                disabled={currentStep === 1}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            {currentStep < 3 ? (
                                <Button onClick={handleNextStep} className="gradient-primary">
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={creatingOrder}
                                    className="gradient-success"
                                    size="lg"
                                >
                                    {creatingOrder ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            Place Order (${total.toFixed(2)})
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky top-24"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span className="font-medium">
                        {shipping === 0 ? (
                            <span className="text-green-600">FREE</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                      </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tax (10%)</span>
                                            <span className="font-medium">${tax.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-2xl text-green-600 dark:text-green-400">
                      ${total.toFixed(2)}
                    </span>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="pt-4 space-y-3 border-t">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Lock className="w-4 h-4 text-green-600" />
                                            <span className="text-muted-foreground">
                        Secure checkout
                      </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Truck className="w-4 h-4 text-blue-600" />
                                            <span className="text-muted-foreground">
                        Fast delivery
                      </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                            <span className="text-muted-foreground">
                        Quality guaranteed
                      </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}