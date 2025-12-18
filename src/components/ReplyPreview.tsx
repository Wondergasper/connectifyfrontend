// Reply Preview Component
import { X } from 'lucide-react';

interface Message {
    _id: string;
    content: string;
    sender: {
        _id: string;
        name: string;
    };
}

interface ReplyPreviewProps {
    replyToMessage: Message | null;
    onCancel: () => void;
}

export const ReplyPreview = ({ replyToMessage, onCancel }: ReplyPreviewProps) => {
    if (!replyToMessage) return null;

    return (
        <div className="px-6 py-2 bg-muted/30 border-t border-border flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <div>
                        <p className="text-xs text-muted-foreground">Replying to {replyToMessage.sender.name}</p>
                        <p className="text-sm text-foreground line-clamp-1">{replyToMessage.content}</p>
                    </div>
                </div>
            </div>
            <button
                onClick={onCancel}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
                <X className="w-4 h-4 text-muted-foreground" />
            </button>
        </div>
    );
};
