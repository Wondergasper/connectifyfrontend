import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useUnreadCount,
  useRealTimeMessages
} from '@/hooks/useMessages';
import { useProfile } from '@/hooks/useAuth';
import { ArrowLeft, Search, Send, User, Check, CheckCheck, Paperclip, Smile, Reply, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Conversation, Message, User as UserType } from '@/lib/apiTypes';
import { useWebSocket } from '@/lib/websocket';
import { useAuth } from '@/contexts/AuthContext';
import { MessageBubble } from '@/components/MessageBubble';
import { ReplyPreview } from '@/components/ReplyPreview';
import { MessageFileUpload } from '@/components/MessageFileUpload';

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch user profile and conversations
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: conversations, isLoading: conversationsLoading, isError: conversationsError } = useConversations();
  const { data: unreadCount } = useUnreadCount();
  const { data: messages, isLoading: messagesLoading, isError: messagesError } = useMessages(selectedChat || '');

  // Get WebSocket connection
  const { token, userId } = useAuth();
  const { socket } = useWebSocket(token, userId);

  // Initialize real-time message functionality
  useRealTimeMessages(selectedChat || '');

  const sendMessageMutation = useSendMessage();

  // Listen for typing indicators
  useEffect(() => {
    if (!socket || !selectedChat) return;

    const handleUserTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === selectedChat && data.userId !== userId) {
        setIsTyping(true);

        // Auto-stop typing indicator after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    const handleUserStoppedTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === selectedChat) {
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    };

    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, selectedChat, userId]);

  // Handle typing events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    if (!socket || !selectedChat) return;

    // Emit typing start
    if (value.length > 0) {
      socket.emit('typingStart', { conversationId: selectedChat });
    }

    // Debounce typing stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typingStop', { conversationId: selectedChat });
    }, 1000);
  };

  // Track online users
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  // Listen for online status changes
  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (data: { userId: string }) => {
      setOnlineUsers(prev => new Set(prev).add(data.userId));
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    const handleUserStatusChanged = (data: { userId: string; isActive: boolean }) => {
      if (data.isActive) {
        setOnlineUsers(prev => new Set(prev).add(data.userId));
      } else {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    };

    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('userStatusChanged', handleUserStatusChanged);

    // Emit that current user is online
    if (userId) {
      socket.emit('setOnline');
    }

    return () => {
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('userStatusChanged', handleUserStatusChanged);
      // Emit offline when component unmounts
      if (userId) {
        socket.emit('setOffline');
      }
    };
  }, [socket, userId]);

  // Reply-to message state
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // Filter conversations based on search query
  const filteredConversations = conversations?.data?.filter((conversation: Conversation) => {
    if (!searchQuery) return true;

    const otherParticipant = conversation.participants?.find((p: UserType) =>
      p._id !== profileData?.data?.user?._id
    );

    return (
      otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    sendMessageMutation.mutate({
      conversationId: selectedChat,
      content: messageInput
    }, {
      onSuccess: () => {
        setMessageInput('');
        // The hook will automatically refetch data
      },
      onError: () => {
        toast.error('Failed to send message');
      }
    });
  };

  if (conversationsError || profileLoading) {
    return <div className="p-6 text-center text-red-500">Error loading conversations</div>;
  }

  // Get current user ID from profile
  const currentUserId = profileData?.data?.user?._id;

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                if (selectedChat) {
                  setSelectedChat(null);
                } else {
                  navigate(-1);
                }
              }}
              className="p-2 hover:bg-muted rounded-xl transition-smooth"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">
              {selectedChat
                ? conversations?.data?.find((c: Conversation) => c._id === selectedChat)?.participants?.find((p: UserType) =>
                  p._id !== currentUserId
                )?.name || "Messages"
                : "Messages"}
              {unreadCount && unreadCount.data?.unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-white text-xs">
                  {unreadCount.data.unreadCount}
                </span>
              )}
            </h1>
          </div>

          {!selectedChat && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="h-12 pl-12 pr-4 bg-muted/30 border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Chat List or Conversation */}
      <div className="flex-1 overflow-y-auto">
        {conversationsLoading && !selectedChat ? (
          <div className="px-6 pt-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full p-4 rounded-2xl bg-card border border-border animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                      </div>
                      <div className="h-3 bg-muted rounded w-10"></div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded-full w-6 h-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !selectedChat ? (
          // Chat List
          <div className="px-6 pt-4 space-y-2">
            {filteredConversations.map((conversation: Conversation) => {
              const otherParticipant = conversation.participants?.find((p: UserType) =>
                p._id !== currentUserId
              );
              return (
                <button
                  key={conversation._id}
                  onClick={() => setSelectedChat(conversation._id)}
                  className="w-full p-4 rounded-2xl bg-card border border-border hover:border-primary transition-smooth text-left shadow-soft hover:shadow-medium"
                >
                  <div className="flex gap-4">
                    <div className="relative w-14 h-14 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                      <User className="w-7 h-7 text-white" />
                      {/* Online Status Indicator */}
                      {otherParticipant && onlineUsers.has(otherParticipant._id) && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-foreground">{otherParticipant?.name || 'User'}</h3>
                          <p className="text-xs text-muted-foreground">{conversation.service?.name || 'No service'}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-accent text-white text-xs font-medium">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {searchQuery && filteredConversations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No conversations found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : messagesError ? (
          <div className="p-6 text-center text-red-500">Error loading messages</div>
        ) : messagesLoading ? (
          <div className="px-6 py-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-start">
                <div className="max-w-[75%] order-1">
                  <div className="p-4 rounded-2xl bg-card border border-border rounded-bl-sm">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Conversation View
          <div className="px-6 py-4 space-y-4">
            {messages?.data?.map((message: Message) => {
              const isCurrentUser = message.sender._id === currentUserId;
              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] ${isCurrentUser ? "order-2" : "order-1"}`}>
                    <div
                      className={`p-4 rounded-2xl ${isCurrentUser
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-card border border-border rounded-bl-sm"
                        }`}
                    >
                      <p className={`text-sm ${isCurrentUser ? "text-white" : "text-foreground"}`}>
                        {message.content}
                      </p>
                    </div>
                    <span
                      className={`text-xs text-muted-foreground mt-1 block ${isCurrentUser ? "text-right" : "text-left"
                        }`}
                    >
                      {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[75%] order-1">
                  <div className="p-4 rounded-2xl bg-card border border-border rounded-bl-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block">typing...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Input (only in conversation view) */}
      {selectedChat && (
        <div className="p-6 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="flex gap-3">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={handleInputChange}
              className="h-12 bg-muted/30 border-0"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={sendMessageMutation.isPending}
            />
            <Button
              className="h-12 w-12 p-0 bg-accent hover:bg-accent/90"
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !messageInput.trim()}
            >
              {sendMessageMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
