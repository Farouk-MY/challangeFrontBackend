'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import {
    useCategories,
    useDeleteCategory,
} from '@/lib/react-query/hooks/useCategories';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import CategoryFormDialog from '@/components/admin/CategoryFormDialog';
import { Category } from '@/types';

export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const { data, isLoading } = useCategories();
    const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

    const categories = data?.data?.categories || [];

    // Filter categories based on search
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = (category: Category) => {
        setDeletingCategory(category);
    };

    const confirmDelete = () => {
        if (deletingCategory) {
            deleteCategory(deletingCategory.id, {
                onSuccess: () => setDeletingCategory(null),
            });
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingCategory(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage product categories
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </div>

            {/* Stats Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Categories</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {categories.length}
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Products</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0)}
                            </p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-muted-foreground">Avg Products/Category</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {categories.length > 0
                                    ? Math.round(
                                        categories.reduce((sum, cat) => sum + (cat._count?.products || 0), 0) /
                                        categories.length
                                    )
                                    : 0}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Categories Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredCategories.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? 'No categories found' : 'No categories yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Arabic Name</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead className="text-center">Products</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCategories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {category.nameAr || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{category.slug}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {category._count?.products || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(category)}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Category Form Dialog */}
            <CategoryFormDialog
                open={isFormOpen}
                onClose={handleFormClose}
                category={editingCategory}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deletingCategory}
                onOpenChange={() => setDeletingCategory(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deletingCategory?.name}"?
                            {deletingCategory?._count?.products && deletingCategory._count.products > 0 && (
                                <span className="block mt-2 text-red-600 dark:text-red-400 font-semibold">
                                    Warning: This category has {deletingCategory._count.products} product(s).
                                    You cannot delete it until products are removed or reassigned.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting || (deletingCategory?._count?.products || 0) > 0}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}