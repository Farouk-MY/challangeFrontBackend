'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, User, Calendar, MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface MessageDetailsDialogProps {
    message: any;
    open: boolean;
    onClose: () => void;
}

const statusColors = {
    PENDING: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    RESOLVED: 'bg-green-500',
};

export default function MessageDetailsDialog({
                                                 message,
                                                 open,
                                                 onClose,
                                             }: MessageDetailsDialogProps) {
    const [reply, setReply] = useState('');
    const [newStatus, setNewStatus] = useState(message.status);
    const queryClient = useQueryClient();

    const { mutate: sendReply, isPending: isSending } = useMutation({
        mutationFn: async (replyText: string) => {
            const response = await apiClient.post(`/contact/${message.id}/reply`, {
                reply: replyText,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'contact-stats'] });
            toast.success('Reply sent successfully!');
            setReply('');
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send reply');
        },
    });

    const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
        mutationFn: async (status: string) => {
            const response = await apiClient.patch(`/contact/${message.id}/status`, {
                status,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'contact-stats'] });
            toast.success('Status updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    const handleSendReply = () => {
        if (!reply.trim()) {
            toast.error('Please enter a reply');
            return;
        }
        sendReply(reply);
    };

    const handleStatusChange = (status: string) => {
        setNewStatus(status);
        updateStatus(status);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Message Details</DialogTitle>
                    <DialogDescription>
                        View and respond to customer inquiry
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Message Info */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <User className="w-4 h-4" />
                                            <span>From</span>
                                        </div>
                                        <p className="font-medium">{message.name}</p>
                                    </div>
                                    <Badge
                                        className={`${
                                            statusColors[newStatus as keyof typeof statusColors]
                                        } text-white`}
                                    >
                                        {newStatus.replace('_', ' ')}
                                    </Badge>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Mail className="w-4 h-4" />
                                        <span>Email</span>
                                    </div>
                                    <p>{message.email}</p>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>Received</span>
                                    </div>
                                    <p>
                                        {format(new Date(message.createdAt), 'MMMM dd, yyyy HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subject */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-2">Subject</h3>
                            <p className="text-lg">{message.subject}</p>
                        </CardContent>
                    </Card>

                    {/* Message */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4" />
                                <h3 className="font-semibold">Message</h3>
                            </div>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.message}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Previous Reply (if exists) */}
                    {message.reply && (
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Send className="w-4 h-4 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                        Your Reply
                                    </h3>
                                </div>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-blue-900 dark:text-blue-100">
                                    {message.reply}
                                </p>
                                {message.repliedAt && (
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                                        Replied on{' '}
                                        {format(new Date(message.repliedAt), 'MMMM dd, yyyy HH:mm')}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Separator />

                    {/* Update Status */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="status">Update Status</Label>
                                <Select value={newStatus} onValueChange={handleStatusChange}>
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reply Form */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reply">
                                        {message.reply ? 'Send Another Reply' : 'Send Reply'}
                                    </Label>
                                    <Textarea
                                        id="reply"
                                        placeholder="Type your reply here..."
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        rows={6}
                                        className="resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="outline" onClick={onClose}>
                                        Close
                                    </Button>
                                    <Button
                                        onClick={handleSendReply}
                                        disabled={isSending || !reply.trim()}
                                        className="gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        {isSending ? 'Sending...' : 'Send Reply'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}