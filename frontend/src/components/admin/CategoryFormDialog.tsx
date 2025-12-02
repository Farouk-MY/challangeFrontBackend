'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    useCreateCategory,
    useUpdateCategory,
} from '@/lib/react-query/hooks/useCategories';
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
import { Category } from '@/types';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    nameAr: z.string().optional(),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
    open: boolean;
    onClose: () => void;
    category?: Category | null;
}

export default function CategoryFormDialog({
                                               open,
                                               onClose,
                                               category,
                                           }: CategoryFormDialogProps) {
    const isEditing = !!category;

    const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            nameAr: '',
            slug: '',
            image: '',
        },
    });

    // Auto-generate slug from name
    const name = watch('name');
    useEffect(() => {
        if (!isEditing && name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setValue('slug', slug);
        }
    }, [name, isEditing, setValue]);

    // Populate form when editing
    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                nameAr: category.nameAr || '',
                slug: category.slug,
                image: category.image || '',
            });
        } else {
            reset({
                name: '',
                nameAr: '',
                slug: '',
                image: '',
            });
        }
    }, [category, reset]);

    const onSubmit = (data: CategoryFormData) => {
        const payload = {
            ...data,
            nameAr: data.nameAr || undefined,
            image: data.image || undefined,
        };

        if (isEditing) {
            updateCategory(
                { id: category.id, data: payload },
                {
                    onSuccess: () => {
                        onClose();
                        reset();
                    },
                }
            );
        } else {
            createCategory(payload, {
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
    };

    const isPending = isCreating || isUpdating;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update category information below'
                            : 'Fill in the details to create a new category'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name (English) */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name (English) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="e.g., Electronics"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Name (Arabic) */}
                    <div className="space-y-2">
                        <Label htmlFor="nameAr">Name (Arabic)</Label>
                        <Input
                            id="nameAr"
                            placeholder="e.g., إلكترونيات"
                            {...register('nameAr')}
                            dir="rtl"
                        />
                        {errors.nameAr && (
                            <p className="text-sm text-red-500">{errors.nameAr.message}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Slug <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="slug"
                            placeholder="e.g., electronics"
                            {...register('slug')}
                        />
                        <p className="text-xs text-muted-foreground">
                            URL-friendly version (lowercase, hyphens only)
                        </p>
                        {errors.slug && (
                            <p className="text-sm text-red-500">{errors.slug.message}</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                            id="image"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            {...register('image')}
                        />
                        {errors.image && (
                            <p className="text-sm text-red-500">{errors.image.message}</p>
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
                                    ? 'Update Category'
                                    : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}