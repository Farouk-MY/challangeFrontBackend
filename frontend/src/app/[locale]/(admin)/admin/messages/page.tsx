'use client';

import { useState } from 'react';
import { Search, Eye, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import MessageDetailsDialog from '@/components/admin/MessageDetailsDialog';
import { format } from 'date-fns';

const statusColors = {
    PENDING: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    RESOLVED: 'bg-green-500',
};

const statusIcons = {
    PENDING: Clock,
    IN_PROGRESS: AlertCircle,
    RESOLVED: CheckCircle,
};

export default function MessagesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'contacts', page, statusFilter, searchQuery],
        queryFn: async () => {
            const response = await apiClient.get('/contact/admin/all', {
                params: {
                    page: page.toString(),
                    limit: '10',
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    search: searchQuery || undefined,
                },
            });
            return response.data;
        },
    });

    const { data: statsData } = useQuery({
        queryKey: ['admin', 'contact-stats'],
        queryFn: async () => {
            const response = await apiClient.get('/contact/admin/stats');
            return response.data;
        },
    });

    const contacts = data?.data?.contacts || [];
    const pagination = data?.data?.pagination;
    const stats = statsData?.data?.stats;

    const handleViewMessage = (message: any) => {
        setSelectedMessage(message);
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
            <div>
                <h1 className="text-3xl font-bold">Messages & Support</h1>
                <p className="text-muted-foreground mt-1">
                    View and respond to customer inquiries
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Messages</p>
                                <p className="text-2xl font-bold">{stats?.totalMessages || 0}</p>
                            </div>
                            <Mail className="w-8 h-8 text-slate-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {stats?.pendingMessages || 0}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats?.inProgressMessages || 0}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Resolved</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats?.resolvedMessages || 0}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search messages by name, email, or subject..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Messages</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="RESOLVED">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Messages Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Messages ({pagination?.total || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {contacts.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'No messages found'
                                    : 'No messages yet'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>From</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contacts.map((contact: any) => {
                                            const StatusIcon = statusIcons[contact.status as keyof typeof statusIcons];
                                            return (
                                                <TableRow key={contact.id}>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">{contact.name}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {contact.email}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="font-medium line-clamp-1">
                                                            {contact.subject}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            {contact.message}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(contact.createdAt),
                                                            'MMM dd, yyyy'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={`${
                                                                statusColors[contact.status as keyof typeof statusColors]
                                                            } text-white`}
                                                        >
                                                            <StatusIcon className="w-3 h-3 mr-1" />
                                                            {contact.status.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewMessage(contact)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === pagination.totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Message Details Dialog */}
            {selectedMessage && (
                <MessageDetailsDialog
                    message={selectedMessage}
                    open={!!selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                />
            )}
        </div>
    );
}