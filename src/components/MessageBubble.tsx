// Enhanced Message Bubble Component
import { Reply, Smile } from 'lucide-react';
import { MessageStatus } from './MessageStatus';
import { useState } from 'react';

interface Message {
    _id: string;
    content: string;
    sender: {
        _id: string;
        name: string;
    };
    recipient: string;
    createdAt?: string;
    status?: 'sent' | 'delivered' | 'read';
    repliedTo?: {
        _id: string;
        content: string;
        sender: {
            name: string;
        };
    };
    reactions?: Array<{
        user: string;
        emoji: string;
        addedAt: Date;
    }>;
    attachments?: Array<{
        url: string;
        type: string;
        name: string;
        size: number;
    }>;
}

interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    currentUserId: string;
    onReply?: (message: Message) => void;
    onReact?: (messageId: string, emoji: string) => void;
}

const QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export const MessageBubble = ({ message, isCurrentUser, currentUserId, onReply, onReact }: MessageBubbleProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // Group reactions by emoji
    const groupedReactions = (message.reactions || []).reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = 0;
        }
        acc[reaction.emoji]++;
        return acc;
    }, {} as Record<string, number>);

    const handleEmojiClick = (emoji: string) => {
        onReact?.(message._id, emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className={`flex group ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] ${isCurrentUser ? "order-2" : "order-1"}`}>
                <div
                    className={`p-4 rounded-2xl relative ${isCurrentUser
                            ? "bg-accent text-white rounded-br-sm"
                            : "bg-card border border-border rounded-bl-sm"
                        }`}
                >
                    {/* Reply To Message Preview */}
                    {message.repliedTo && (
                        <div className={`mb-2 pb-2 border-l-2 pl-2 ${isCurrentUser ? 'border-white/30' : 'border-primary/30'}`}>
                            <p className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                                Replying to {message.repliedTo.sender.name}
                            </p>
                            <p className={`text-xs ${isCurrentUser ? 'text-white/90' : 'text-foreground/70'}`}>
                                {message.repliedTo.content}
                            </p>
                        </div>
                    )}

                    <p className={`text-sm ${isCurrentUser ? "text-white" : "text-foreground"}`}>
                        {message.content}
                    </p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment, idx) => (
                                <div key={idx} className={`p-2 rounded border ${isCurrentUser ? 'border-white/20 bg-white/10' : 'border-border bg-muted/30'}`}>
                                    {attachment.type.startsWith('image/') ? (
                                        <img
                                            src={attachment.url}
                                            alt={attachment.name}
                                            className="max-w-full rounded"
                                        />
                                    ) : (
                                        <a
                                            href={attachment.url}
                                            download={attachment.name}
                                            className={`text-xs flex items-center gap-2 ${isCurrentUser ? 'text-white' : 'text-primary'}`}
                                        >
                                            📄 {attachment.name}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons (show on hover) */}
                    <div className={`absolute -top-3 ${isCurrentUser ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                        <button
                            onClick={() => onReply?.(message)}
                            className="p-1 bg-card border border-border rounded-full hover:bg-muted transition-colors shadow-soft"
                            title="Reply"
                        >
                            <Reply className="w-3 h-3 text-foreground" />
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="p-1 bg-card border border-border rounded-full hover:bg-muted transition-colors shadow-soft"
                                title="React"
                            >
                                <Smile className="w-3 h-3 text-foreground" />
                            </button>

                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div className="absolute top-full mt-1 p-2 bg-card border border-border rounded-lg shadow-lg flex gap-2 z-10">
                                    {QUICK_EMOJIS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleEmojiClick(emoji)}
                                            className="text-xl hover:scale-125 transition-transform"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message Reactions */}
                    {Object.keys(groupedReactions).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {Object.entries(groupedReactions).map(([emoji, count]) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleEmojiClick(emoji)}
                                    className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${isCurrentUser ? 'bg-white/20' : 'bg-muted/30'
                                        } hover:scale-105 transition-transform`}
                                >
                                    <span>{emoji}</span>
                                    {count > 1 && (
                                        <span className={isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Timestamp and Delivery Status */}
                <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <span className="text-xs text-muted-foreground">
                        {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>

                    {/* Delivery Status */}
                    <MessageStatus status={message.status} isCurrentUser={isCurrentUser} />
                </div>
            </div>
        </div>
    );
};
