// Message Delivery Status Component
import { Check, CheckCheck } from 'lucide-react';

interface MessageStatusProps {
    status?: 'sent' | 'delivered' | 'read';
    isCurrentUser: boolean;
}

export const MessageStatus = ({ status, isCurrentUser }: MessageStatusProps) => {
    if (!isCurrentUser) return null;

    return (
        <span className="flex items-center ml-1">
            {status === 'read' ? (
                <CheckCheck className="w-3 h-3 text-blue-500" title="Read" />
            ) : status === 'delivered' ? (
                <CheckCheck className="w-3 h-3 text-muted-foreground" title="Delivered" />
            ) : (
                <Check className="w-3 h-3 text-muted-foreground" title="Sent" />
            )}
        </span>
    );
};
