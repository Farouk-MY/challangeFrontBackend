'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
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
} from 'lucide-react';
import { useMe } from '@/lib/react-query/hooks';
import {
    useAddresses,
    useUpdateProfile,
    useCreateAddress,
    useDeleteAddress,
    useSetDefaultAddress,
} from '@/lib/react-query/hooks/useUsers';
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
    const [editingProfile, setEditingProfile] = useState(false);
    const [addingAddress, setAddingAddress] = useState(false);
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

    // Queries
    const { data: userData, isLoading: userLoading } = useMe();
    const { data: addressesData, isLoading: addressesLoading } = useAddresses();

    // Mutations
    const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile();
    const { mutate: createAddress, isPending: creatingAddress } = useCreateAddress();
    const { mutate: deleteAddress } = useDeleteAddress();
    const { mutate: setDefaultAddress } = useSetDefaultAddress();

    const user = userData?.data?.user;
    const addresses = addressesData?.data?.addresses || [];

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

    const stats = [
        {
            icon: Package,
            label: 'Total Orders',
            value: '0',
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            icon: Heart,
            label: 'Wishlist Items',
            value: '0',
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-100 dark:bg-red-900/30',
        },
        {
            icon: MapPin,
            label: 'Addresses',
            value: addresses.length.toString(),
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
                                        {user.isVerified ? 'Verified' : 'Not Verified'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" onClick={() => setProfileData({ name: user.name, avatar: user.avatar || '' })}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your profile information
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Name</Label>
                                            <Input
                                                value={profileData.name}
                                                onChange={(e) =>
                                                    setProfileData({ ...profileData, name: e.target.value })
                                                }
                                                placeholder="Your name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Avatar URL</Label>
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
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleUpdateProfile}
                                            disabled={updatingProfile}
                                        >
                                            {updatingProfile ? 'Saving...' : 'Save Changes'}
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
                                Addresses
                            </TabsTrigger>
                            <TabsTrigger value="orders">
                                <Package className="w-4 h-4 mr-2" />
                                Orders
                            </TabsTrigger>
                            <TabsTrigger value="wishlist">
                                <Heart className="w-4 h-4 mr-2" />
                                Wishlist
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>My Addresses</CardTitle>
                                        <CardDescription>
                                            Manage your delivery addresses
                                        </CardDescription>
                                    </div>
                                    <Dialog open={addingAddress} onOpenChange={setAddingAddress}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Address
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Add New Address</DialogTitle>
                                                <DialogDescription>
                                                    Add a new delivery address
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
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleAddAddress}
                                                    disabled={creatingAddress}
                                                >
                                                    {creatingAddress ? 'Adding...' : 'Add Address'}
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
                                                No addresses added yet
                                            </p>
                                            <Button onClick={() => setAddingAddress(true)}>
                                                Add Your First Address
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
                                                                    <Badge>Default</Badge>
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
                                                                    Set Default
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

                        {/* Orders Tab */}
                        <TabsContent value="orders">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Orders</CardTitle>
                                    <CardDescription>View and track your orders</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            No orders yet
                                        </p>
                                        <Button asChild>
                                            <Link href="/products">Start Shopping</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Wishlist Tab */}
                        <TabsContent value="wishlist">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Wishlist</CardTitle>
                                    <CardDescription>Your saved products</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            Your wishlist is empty
                                        </p>
                                        <Button asChild>
                                            <Link href="/products">Browse Products</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Manage your account preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between py-4 border-b">
                                        <div>
                                            <h4 className="font-medium">Email Verification</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {user.isVerified
                                                    ? 'Your email is verified'
                                                    : 'Please verify your email'}
                                            </p>
                                        </div>
                                        {!user.isVerified && (
                                            <Button variant="outline">Send Verification</Button>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b">
                                        <div>
                                            <h4 className="font-medium">Change Password</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Update your password
                                            </p>
                                        </div>
                                        <Button variant="outline">Change</Button>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <div>
                                            <h4 className="font-medium text-red-600">Delete Account</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Permanently delete your account
                                            </p>
                                        </div>
                                        <Button variant="destructive">Delete</Button>
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


