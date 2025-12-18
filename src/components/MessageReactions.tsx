// Message Reactions Component
import { Smile } from 'lucide-react';
import { useState } from 'react';

interface Reaction {
    user: string;
    emoji: string;
    addedAt: Date;
}

interface MessageReactionsProps {
    reactions?: Reaction[];
    onAddReaction?: (emoji: string) => void;
    isCurrentUser: boolean;
}

const QUICK_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🙏'];

export const MessageReactions = ({ reactions = [], onAddReaction, isCurrentUser }: MessageReactionsProps) => {
    const [showPicker, setShowPicker] = useState(false);

    // Group reactions by emoji
    const groupedReactions = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction);
        return acc;
    }, {} as Record<string, Reaction[]>);

    const handleEmojiClick = (emoji: string) => {
        onAddReaction?.(emoji);
        setShowPicker(false);
    };

    return (
        <div className="relative">
            {/* Existing Reactions */}
            {Object.keys(groupedReactions).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(groupedReactions).map(([emoji, reactionsList]) => (
                        <button
                            key={emoji}
                            onClick={() => handleEmojiClick(emoji)}
                            className="px-2 py-0.5 bg-muted/30 hover:bg-muted/50 rounded-full text-xs transition-colors flex items-center gap-1"
                        >
                            <span>{emoji}</span>
                            {reactionsList.length > 1 && (
                                <span className="text-muted-foreground">{reactionsList.length}</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Quick Emoji Picker */}
            {showPicker && (
                <div className="absolute bottom-full mb-2 p-2 bg-card border border-border rounded-lg shadow-lg flex gap-2 z-10">
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

            {/* Toggle Picker Button */}
            <button
                onClick={() => setShowPicker(!showPicker)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-card border border-border rounded-full hover:bg-muted"
                title="Add reaction"
            >
                <Smile className="w-3 h-3 text-foreground" />
            </button>
        </div>
    );
};
