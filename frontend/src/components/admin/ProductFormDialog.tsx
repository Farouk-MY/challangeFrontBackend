'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import {
    useCreateProduct,
    useUpdateProduct,
} from '@/lib/react-query/hooks';
import { useCategories } from '@/lib/react-query/hooks/useCategories';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/types';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nameAr: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    descriptionAr: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    stock: z.number().int().min(0, 'Stock must be a positive integer'),
    categoryId: z.string().min(1, 'Category is required'),
    featured: z.boolean(),
    images: z.array(z.string().url('Must be valid URLs')).min(1, 'At least one image required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormDialogProps {
    open: boolean;
    onClose: () => void;
    product?: Product | null;
}

export default function ProductFormDialog({
                                              open,
                                              onClose,
                                              product,
                                          }: ProductFormDialogProps) {
    const isEditing = !!product;
    const [imageInput, setImageInput] = useState('');

    const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const { data: categoriesData } = useCategories();

    const categories = categoriesData?.data?.categories || [];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            nameAr: '',
            description: '',
            descriptionAr: '',
            price: 0,
            stock: 0,
            categoryId: '',
            featured: false,
            images: [],
        },
    });

    const images = watch('images');
    const featured = watch('featured');

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                nameAr: product.nameAr || '',
                description: product.description,
                descriptionAr: product.descriptionAr || '',
                price: product.price,
                stock: product.stock,
                categoryId: product.categoryId,
                featured: product.featured,
                images: product.images,
            });
        } else {
            reset({
                name: '',
                nameAr: '',
                description: '',
                descriptionAr: '',
                price: 0,
                stock: 0,
                categoryId: '',
                featured: false,
                images: [],
            });
        }
    }, [product, reset]);

    const addImage = () => {
        if (imageInput.trim()) {
            try {
                new URL(imageInput); // Validate URL
                setValue('images', [...images, imageInput.trim()]);
                setImageInput('');
            } catch {
                alert('Please enter a valid URL');
            }
        }
    };

    const removeImage = (index: number) => {
        setValue('images', images.filter((_, i) => i !== index));
    };

    const onSubmit = (data: ProductFormData) => {
        const payload = {
            ...data,
            nameAr: data.nameAr || undefined,
            descriptionAr: data.descriptionAr || undefined,
        };

        if (isEditing) {
            updateProduct(
                { id: product.id, data: payload },
                {
                    onSuccess: () => {
                        onClose();
                        reset();
                    },
                }
            );
        } else {
            createProduct(payload, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        onClose();
        reset();
        setImageInput('');
    };

    const isPending = isCreating || isUpdating;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update product information below'
                            : 'Fill in the details to create a new product'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Name (English) */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Name (English) <span className="text-red-500">*</span>
                            </Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Name (Arabic) */}
                        <div className="space-y-2">
                            <Label htmlFor="nameAr">Name (Arabic)</Label>
                            <Input id="nameAr" {...register('nameAr')} dir="rtl" />
                        </div>
                    </div>

                    {/* Description (English) */}
                    <div className="space-y-2">
                        <Label htmlFor="description">
                            Description (English) <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Description (Arabic) */}
                    <div className="space-y-2">
                        <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                        <Textarea
                            id="descriptionAr"
                            {...register('descriptionAr')}
                            rows={3}
                            dir="rtl"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price ($) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register('price', { valueAsNumber: true })}
                            />
                            {errors.price && (
                                <p className="text-sm text-red-500">{errors.price.message}</p>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                            <Label htmlFor="stock">
                                Stock <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                {...register('stock', { valueAsNumber: true })}
                            />
                            {errors.stock && (
                                <p className="text-sm text-red-500">{errors.stock.message}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="categoryId">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={watch('categoryId')}
                                onValueChange={(value) => setValue('categoryId', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && (
                                <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="featured"
                            checked={featured}
                            onCheckedChange={(checked) => setValue('featured', checked)}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                        <Label>
                            Product Images <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter image URL"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                            />
                            <Button type="button" onClick={addImage} size="icon">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {errors.images && (
                            <p className="text-sm text-red-500">{errors.images.message}</p>
                        )}

                        {/* Image Preview */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {images.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-24 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending
                                ? isEditing
                                    ? 'Updating...'
                                    : 'Creating...'
                                : isEditing
                                    ? 'Update Product'
                                    : 'Create Product'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}