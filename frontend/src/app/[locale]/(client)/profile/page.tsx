'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import {
    User,
    MapPin,
    Package,
    Heart,
    Settings,
    Mail,
    Calendar,
    Edit,
    Plus,
    Trash2,
    Check,
    Eye,
    EyeOff,
} from 'lucide-react';
import { useMe } from '@/lib/react-query/hooks';
import {
    useAddresses,
    useUpdateProfile,
    useCreateAddress,
    useDeleteAddress,
    useSetDefaultAddress,
} from '@/lib/react-query/hooks/useUsers';
import { useChangePassword, useSendVerificationEmail } from '@/lib/react-query/hooks/useAuth';
import { useUserOrders } from '@/lib/react-query/hooks/useOrders';
import { useWishlist } from '@/lib/react-query/hooks/useWishlist';
import { LoadingPage } from '@/components/shared/LoadingSpinner';
import ErrorDisplay from '@/components/shared/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
    const t = useTranslations();
    const locale = useLocale();
    const [editingProfile, setEditingProfile] = useState(false);
    const [addingAddress, setAddingAddress] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [profileData, setProfileData] = useState({ name: '', avatar: '' });
    const [addressData, setAddressData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        isDefault: false,
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Queries
    const { data: userData, isLoading: userLoading } = useMe();
    const { data: addressesData, isLoading: addressesLoading } = useAddresses();
    const { data: ordersData, isLoading: ordersLoading } = useUserOrders();
    const { data: wishlistData, isLoading: wishlistLoading } = useWishlist();

    // Mutations
    const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();
    const { mutate: createAddress, isPending: creatingAddress } = useCreateAddress();
    const { mutate: deleteAddress } = useDeleteAddress();
    const { mutate: setDefaultAddress } = useSetDefaultAddress();
    const { mutate: changePassword, isPending: changingPasswordLoading } = useChangePassword();
    const { mutate: sendVerificationEmail, isPending: sendingVerification } = useSendVerificationEmail();

    const user = userData?.data?.user;
    const addresses = addressesData?.data?.addresses || [];
    const orders = ordersData?.data?.orders || [];
    const wishlist = wishlistData?.data?.wishlist || [];

    if (userLoading) return <LoadingPage />;
    if (!user) return <ErrorDisplay title="Please login to view your profile" />;

    const handleUpdateProfile = () => {
        updateProfile(profileData, {
            onSuccess: () => {
                setEditingProfile(false);
                setProfileData({ name: '', avatar: '' });
            },
        });
    };

    const handleAddAddress = () => {
        createAddress(addressData, {
            onSuccess: () => {
                setAddingAddress(false);
                setAddressData({
                    name: '',
                    phone: '',
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    isDefault: false,
                });
            },
        });
    };

    const handleChangePassword = () => {
        // Validate passwords match
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return; // Error will be shown in UI
        }

        // Validate password length
        if (passwordData.newPassword.length < 6) {
            return; // Error will be shown in UI
        }

        changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        }, {
            onSuccess: () => {
                setChangingPassword(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            },
        });
    };

    const handleSendVerification = () => {
        sendVerificationEmail();
    };

    const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;
    const passwordLengthValid = passwordData.newPassword.length >= 6 || passwordData.newPassword.length === 0;
    const canSubmitPassword = passwordData.currentPassword &&
        passwordData.newPassword &&
        passwordData.confirmPassword &&
        passwordsMatch &&
        passwordLengthValid;

    const stats = [
        {
            icon: Package,
            label: t('profile.totalOrders') || 'Total Orders',
            value: ordersLoading ? '...' : orders.length.toString(),
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            icon: Heart,
            label: t('profile.wishlistItems') || 'Wishlist Items',
            value: wishlistLoading ? '...' : wishlist.length.toString(),
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
        },
        {
            icon: MapPin,
            label: t('profile.addresses') || 'Addresses',
            value: addressesLoading ? '...' : addresses.length.toString(),
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
        },
    ];

    return (
        <ProtectedRoute requireAuth={true}>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white">
                    <div className="container-custom py-12">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="relative"
                            >
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {user.isVerified && (
                                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </motion.div>

                            {/* Info */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                                <p className="text-blue-100 flex items-center gap-2 mb-3">
                                    <Mail className="w-4 h-4" />
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-3">
                                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                        {user.role}
                                    </Badge>
                                    <Badge
                                        variant={user.isVerified ? 'default' : 'outline'}
                                        className={user.isVerified ? 'bg-green-500' : ''}
                                    >
                                        {user.isVerified ? (t('profile.verified') || 'Verified') : (t('profile.notVerified') || 'Not Verified')}
                                    </Badge>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" onClick={() => setProfileData({ name: user.name, avatar: user.avatar || '' })}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        {t('profile.editProfile')}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t('profile.editProfile')}</DialogTitle>
                                        <DialogDescription>
                                            {t('profile.updateProfileInfo') || 'Update your profile information'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>{t('auth.name')}</Label>
                                            <Input
                                                value={profileData.name}
                                                onChange={(e) =>
                                                    setProfileData({ ...profileData, name: e.target.value })
                                                }
                                                placeholder={t('auth.name')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{t('profile.avatarUrl') || 'Avatar URL'}</Label>
                                            <Input
                                                value={profileData.avatar}
                                                onChange={(e) =>
                                                    setProfileData({ ...profileData, avatar: e.target.value })
                                                }
                                                placeholder="https://example.com/avatar.jpg"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setEditingProfile(false)}
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                        <Button
                                            onClick={handleUpdateProfile}
                                            disabled={updatingProfile}
                                        >
                                            {updatingProfile ? (t('profile.saving') || 'Saving...') : (t('common.save') || 'Save Changes')}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                <div className="container-custom py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    {stat.label}
                                                </p>
                                                <p className="text-2xl font-bold">{stat.value}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="addresses" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="addresses">
                                <MapPin className="w-4 h-4 mr-2" />
                                {t('profile.addresses')}
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="w-4 h-4 mr-2" />
                                {t('common.settings')}
                            </TabsTrigger>
                        </TabsList>

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>{t('profile.addresses')}</CardTitle>
                                        <CardDescription>
                                            {t('profile.manageAddresses') || 'Manage your delivery addresses'}
                                        </CardDescription>
                                    </div>
                                    <Dialog open={addingAddress} onOpenChange={setAddingAddress}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                {t('profile.addAddress')}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>{t('profile.addAddress')}</DialogTitle>
                                                <DialogDescription>
                                                    {t('profile.addNewAddress') || 'Add a new delivery address'}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid grid-cols-2 gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Recipient Name *</Label>
                                                    <Input
                                                        value={addressData.name}
                                                        onChange={(e) =>
                                                            setAddressData({ ...addressData, name: e.target.value })
                                                        }
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone *</Label>
                                                    <Input
                                                        value={addressData.phone}
                                                        onChange={(e) =>
                                                            setAddressData({ ...addressData, phone: e.target.value })
                                                        }
                                                        placeholder="+1 234 567 8900"
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label>Street Address *</Label>
                                                    <Input
                                                        value={addressData.street}
                                                        onChange={(e) =>
                                                            setAddressData({ ...addressData, street: e.target.value })
                                                        }
                                                        placeholder="123 Main Street"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>City *</Label>
                                                    <Input
                                                        value={addressData.city}
                                                        onChange={(e) =>
                                                            setAddressData({ ...addressData, city: e.target.value })
                                                        }
                                                        placeholder="New York"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>State</Label>
                                                    <Input
                                                        value={addressData.state}
                                                        onChange={(e) =>
                                                            setAddressData({ ...addressData, state: e.target.value })
                                                        }
                                                        placeholder="NY"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Country *</Label>
                                                    <Input
                                                        value={addressData.country}
                                                        onChange={(e) =>
                                                            setAddressData({
                                                                ...addressData,
                                                                country: e.target.value,
                                                            })
                                                        }
                                                        placeholder="United States"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Zip Code</Label>
                                                    <Input
                                                        value={addressData.zipCode}
                                                        onChange={(e) =>
                                                            setAddressData({
                                                                ...addressData,
                                                                zipCode: e.target.value,
                                                            })
                                                        }
                                                        placeholder="10001"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={addressData.isDefault}
                                                            onChange={(e) =>
                                                                setAddressData({
                                                                    ...addressData,
                                                                    isDefault: e.target.checked,
                                                                })
                                                            }
                                                            className="rounded"
                                                        />
                                                        <span className="text-sm">Set as default address</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setAddingAddress(false)}
                                                >
                                                    {t('common.cancel')}
                                                </Button>
                                                <Button
                                                    onClick={handleAddAddress}
                                                    disabled={creatingAddress}
                                                >
                                                    {creatingAddress ? (t('profile.addingAddress') || 'Adding...') : t('profile.addAddress')}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </CardHeader>
                                <CardContent>
                                    {addressesLoading ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="h-32 skeleton rounded-lg" />
                                            ))}
                                        </div>
                                    ) : addresses.length === 0 ? (
                                        <div className="text-center py-12">
                                            <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground mb-4">
                                                {t('profile.noAddresses') || 'No addresses added yet'}
                                            </p>
                                            <Button onClick={() => setAddingAddress(true)}>
                                                {t('profile.addFirstAddress') || 'Add Your First Address'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {addresses.map((address) => (
                                                <motion.div
                                                    key={address.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <h4 className="font-semibold">{address.name}</h4>
                                                                {address.isDefault && (
                                                                    <Badge>{t('profile.defaultAddress')}</Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {address.street}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {address.city}, {address.state} {address.zipCode}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {address.country}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                📞 {address.phone}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            {!address.isDefault && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setDefaultAddress(address.id)}
                                                                >
                                                                    {t('profile.setDefault') || 'Set Default'}
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => deleteAddress(address.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('profile.accountSettings') || 'Account Settings'}</CardTitle>
                                    <CardDescription>{t('profile.managePreferences') || 'Manage your account preferences'}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Email Verification */}
                                    <div className="flex items-center justify-between py-4 border-b">
                                        <div>
                                            <h4 className="font-medium">{t('profile.emailVerification') || 'Email Verification'}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {user.isVerified
                                                    ? (t('profile.emailVerified') || 'Your email is verified')
                                                    : (t('profile.pleaseVerify') || 'Please verify your email address')}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleSendVerification}
                                            disabled={user.isVerified || sendingVerification}
                                        >
                                            {sendingVerification ? (t('profile.sending') || 'Sending...') : (t('profile.sendVerification') || 'Send Verification')}
                                        </Button>
                                    </div>

                                    {/* Change Password */}
                                    <div className="flex items-center justify-between py-4 border-b">
                                        <div>
                                            <h4 className="font-medium">{t('profile.changePassword')}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {t('profile.updatePassword') || 'Update your account password'}
                                            </p>
                                        </div>
                                        <Dialog open={changingPassword} onOpenChange={setChangingPassword}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">{t('profile.change') || 'Change'}</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{t('profile.changePassword')}</DialogTitle>
                                                    <DialogDescription>
                                                        {t('profile.enterCurrentPassword') || 'Enter your current password and choose a new one'}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    {/* Current Password */}
                                                    <div className="space-y-2">
                                                        <Label>{t('profile.currentPassword') || 'Current Password'} *</Label>
                                                        <div className="relative">
                                                            <Input
                                                                type={showCurrentPassword ? "text" : "password"}
                                                                value={passwordData.currentPassword}
                                                                onChange={(e) =>
                                                                    setPasswordData({
                                                                        ...passwordData,
                                                                        currentPassword: e.target.value
                                                                    })
                                                                }
                                                                placeholder="Enter current password"
                                                                className="pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showCurrentPassword ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* New Password */}
                                                    <div className="space-y-2">
                                                        <Label>{t('profile.newPassword') || 'New Password'} *</Label>
                                                        <div className="relative">
                                                            <Input
                                                                type={showNewPassword ? "text" : "password"}
                                                                value={passwordData.newPassword}
                                                                onChange={(e) =>
                                                                    setPasswordData({
                                                                        ...passwordData,
                                                                        newPassword: e.target.value
                                                                    })
                                                                }
                                                                placeholder="Enter new password"
                                                                className="pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showNewPassword ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {!passwordLengthValid && (
                                                            <p className="text-xs text-red-500">
                                                                {t('profile.passwordLength') || 'Password must be at least 6 characters'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Confirm Password */}
                                                    <div className="space-y-2">
                                                        <Label>{t('auth.confirmPassword')} *</Label>
                                                        <div className="relative">
                                                            <Input
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                value={passwordData.confirmPassword}
                                                                onChange={(e) =>
                                                                    setPasswordData({
                                                                        ...passwordData,
                                                                        confirmPassword: e.target.value
                                                                    })
                                                                }
                                                                placeholder="Confirm new password"
                                                                className="pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        {passwordData.confirmPassword && !passwordsMatch && (
                                                            <p className="text-xs text-red-500">
                                                                {t('profile.passwordsNoMatch') || 'Passwords do not match'}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setChangingPassword(false);
                                                            setPasswordData({
                                                                currentPassword: '',
                                                                newPassword: '',
                                                                confirmPassword: '',
                                                            });
                                                        }}
                                                    >
                                                        {t('common.cancel')}
                                                    </Button>
                                                    <Button
                                                        onClick={handleChangePassword}
                                                        disabled={!canSubmitPassword || changingPasswordLoading}
                                                    >
                                                        {changingPasswordLoading ? (t('profile.changing') || 'Changing...') : t('profile.changePassword')}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <h4 className="font-medium text-red-600">{t('profile.deleteAccount') || 'Delete Account'}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {t('profile.deleteAccountDesc') || 'Permanently delete your account and all data'}
                                            </p>
                                        </div>
                                        <Button variant="destructive">{t('common.delete')}</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </ProtectedRoute>
    );
}