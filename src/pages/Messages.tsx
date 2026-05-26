import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Search, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations, useConversationMessages, useSendMessage } from '@/hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/lib/websocket';
import { api } from '@/lib/api';
import { Conversation, Message } from '@/lib/apiTypes';

const getOtherParticipant = (conversation: Conversation, currentUserId?: string | null) => {
  const participant = conversation.participants?.find((p) => {
    const participantId = typeof p === 'string' ? p : p?._id || p?.id;
    return participantId && participantId !== currentUserId;
  });
  return typeof participant === 'string' ? null : participant || null;
};

const getLastMessageText = (conversation: Conversation) => {
  if (!conversation.lastMessage) return 'No messages yet';
  if (typeof conversation.lastMessage === 'string') return conversation.lastMessage;
  return conversation.lastMessage.content || 'No messages yet';
};

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations();
  const [search, setSearch] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useWebSocket(userId);
  const sendMessageMutation = useSendMessage();

  const conversations = conversationsData?.data || [];
  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) => {
      const otherParticipant = getOtherParticipant(conversation, userId);
      const participantName = otherParticipant?.name?.toLowerCase() || '';
      const serviceName = typeof conversation.service === 'object' ? conversation.service?.name?.toLowerCase() || '' : '';
      const lastMessage = getLastMessageText(conversation).toLowerCase();
      return participantName.includes(query) || serviceName.includes(query) || lastMessage.includes(query);
    });
  }, [conversations, search, userId]);

  // Auto-select conversation from URL param or first in list
  useEffect(() => {
    const requestedConversationId = searchParams.get('conversationId');
    const requestedConversation = requestedConversationId
      ? filteredConversations.find((c) => (c._id || c.id) === requestedConversationId)
      : null;

    if (requestedConversation && selectedConversationId !== requestedConversationId) {
      setSelectedConversationId(requestedConversationId);
      setIsChatOpen(true);
      return;
    }
    if (!selectedConversationId && filteredConversations.length > 0) {
      setSelectedConversationId(filteredConversations[0]._id || filteredConversations[0].id || null);
    }
  }, [filteredConversations, searchParams, selectedConversationId]);

  const selectedConversation = filteredConversations.find((c) => (c._id || c.id) === selectedConversationId) || null;
  const conversationId = selectedConversation?._id || selectedConversation?.id || '';
  const { data: messagesData, isLoading: messagesLoading } = useConversationMessages(conversationId);
  const messages = messagesData?.data || [];

  // Mark as read when conversation opens
  useEffect(() => {
    if (!conversationId) return;
    api.messages.markConversationAsRead(conversationId).catch(() => undefined);
    queryClient.invalidateQueries({ queryKey: ['messages-unread-count'] });
  }, [conversationId, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket: incoming messages + typing indicators
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      const messageConversationId =
        typeof message.conversation === 'string'
          ? message.conversation
          : message.conversation?._id || message.conversation?.id;
      if (messageConversationId) {
        queryClient.invalidateQueries({ queryKey: ['conversation-messages', messageConversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        queryClient.invalidateQueries({ queryKey: ['messages-unread-count'] });
      }
    };

    const handleConversationUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    const handleUserTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId && data.userId !== userId) {
        setOtherIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (data: { userId: string; conversationId: string }) => {
      if (data.conversationId === conversationId && data.userId !== userId) {
        setOtherIsTyping(false);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('conversationUpdated', handleConversationUpdated);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStoppedTyping', handleUserStoppedTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('conversationUpdated', handleConversationUpdated);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStoppedTyping', handleUserStoppedTyping);
    };
  }, [socket, queryClient, conversationId, userId]);

  const emitTyping = () => {
    if (!socket || !conversationId) return;
    socket.emit('typingStart', { conversationId });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typingStop', { conversationId });
    }, 1500);
  };

  const handleSend = async () => {
    if (!conversationId || !draft.trim()) return;
    const content = draft.trim();
    setDraft('');
    if (socket) socket.emit('typingStop', { conversationId });
    await sendMessageMutation.mutateAsync({ conversationId, content });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openConversation = (convId?: string | null) => {
    setSelectedConversationId(convId || null);
    setIsChatOpen(true);
    setOtherIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className={`${isChatOpen ? 'hidden lg:block' : ''} gradient-primary px-5 pt-12 pb-9 text-white shadow-strong sm:px-6 lg:px-8`}>
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/20 shadow-soft backdrop-blur-sm transition-smooth hover:bg-white/30"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight drop-shadow-md">Messages</h1>
            <p className="mt-1 text-sm text-white/80">Keep every booking conversation in one place</p>
          </div>
        </div>
      </div>

      <div className={`${isChatOpen ? 'pt-4 lg:-mt-5 lg:pt-0' : '-mt-5'} mx-auto grid max-w-6xl gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-[340px_1fr] lg:gap-6 lg:py-6`}>
        {/* Conversations List */}
        <div className={`${isChatOpen ? 'hidden lg:block' : ''} overflow-hidden rounded-3xl border border-border bg-card shadow-medium`}>
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations"
                className="h-12 rounded-2xl border-border bg-muted/40 pl-11 text-base shadow-none"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-220px)] overflow-y-auto lg:max-h-[calc(100vh-240px)]">
            {conversationsLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted/40" />
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation, userId);
                const isSelected = (conversation._id || conversation.id) === selectedConversationId;
                return (
                  <button
                    key={conversation._id || conversation.id}
                    onClick={() => openConversation(conversation._id || conversation.id)}
                    className={`w-full border-b border-border p-4 text-left transition-smooth last:border-b-0 ${
                      isSelected ? 'bg-primary/10 shadow-inner' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-semibold text-white shadow-soft">
                        {otherParticipant?.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {otherParticipant?.name || 'Conversation'}
                          </h3>
                          {!!conversation.unreadCount && conversation.unreadCount > 0 && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm font-medium text-foreground/75">
                          {getLastMessageText(conversation)}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {conversation.service && typeof conversation.service === 'object' ? conversation.service.name : 'Direct chat'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground">No conversations</h3>
                <p className="text-sm text-muted-foreground mt-1">Your messages will appear here once you start chatting.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className={`${isChatOpen ? 'flex' : 'hidden lg:flex'} h-[calc(100vh-2rem)] min-h-[520px] overflow-hidden rounded-3xl border border-border bg-card shadow-medium lg:h-[calc(100vh-150px)] lg:min-h-[70vh]`}>
          {selectedConversation ? (
            <div className="flex min-h-0 w-full flex-col">
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-4">
                <button
                  aria-label="Back to conversations"
                  onClick={() => setIsChatOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-smooth hover:bg-muted/80 lg:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="gradient-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-semibold text-white shadow-soft">
                  {getOtherParticipant(selectedConversation, userId)?.name?.charAt(0) || 'M'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground truncate">
                    {getOtherParticipant(selectedConversation, userId)?.name || 'Conversation'}
                  </h2>
                  {otherIsTyping ? (
                    <p className="text-xs text-primary animate-pulse">typing…</p>
                  ) : (
                    <p className="text-sm text-muted-foreground truncate">
                      {selectedConversation.service && typeof selectedConversation.service === 'object'
                        ? selectedConversation.service.name
                        : 'Direct chat'}
                    </p>
                  )}
                </div>
                <div className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">Active</div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-primary/5 via-background to-background p-4">
                {messagesLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className={`h-12 rounded-2xl bg-muted/40 animate-pulse ${index % 2 === 0 ? 'ml-auto w-2/3' : 'w-2/3'}`} />
                    ))}
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((message) => {
                    const senderId = typeof message.sender === 'string' ? message.sender : message.sender?._id || message.sender?.id;
                    const isMine = senderId && userId && senderId === userId;
                    return (
                      <div key={message._id || message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-soft ${
                            isMine
                              ? 'rounded-br-md bg-primary text-primary-foreground'
                              : 'rounded-bl-md border border-border bg-card text-foreground'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <p className={`text-[11px] mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-center p-6">
                    <div>
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-semibold text-foreground">No messages yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">Send a message to start the conversation.</p>
                    </div>
                  </div>
                )}
                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border bg-card p-3 sm:p-4">
                <div className="flex items-end gap-2 rounded-3xl border border-border bg-muted/40 p-2">
                  <Textarea
                    value={draft}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      emitTyping();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message… (Enter to send, Shift+Enter for new line)"
                    className="min-h-[46px] resize-none border-0 bg-transparent px-3 py-3 shadow-none focus-visible:ring-0"
                  />
                  <Button
                    aria-label="Send message"
                    onClick={handleSend}
                    disabled={!draft.trim() || sendMessageMutation.isPending}
                    className="h-12 w-12 shrink-0 rounded-2xl p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <MessageSquare className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground">Select a conversation</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">Pick a thread from the list to read and send messages.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
