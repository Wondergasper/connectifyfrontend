import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Search, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations, useConversationMessages, useSendMessage } from '@/hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/lib/websocket';
import { Conversation, Message } from '@/lib/apiTypes';

const getOtherParticipant = (conversation: Conversation, currentUserId?: string | null) => {
  const participant = conversation.participants?.find((p) => {
    const participantId = typeof p === 'string' ? p : p?._id || p?.id;
    return participantId && participantId !== currentUserId;
  });

  return typeof participant === 'string' ? null : participant || null;
};

const getLastMessageText = (conversation: Conversation) => {
  if (!conversation.lastMessage) {
    return 'No messages yet';
  }

  if (typeof conversation.lastMessage === 'string') {
    return conversation.lastMessage;
  }

  return conversation.lastMessage.content || 'No messages yet';
};

const Messages = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId, user } = useAuth();
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations();
  const [search, setSearch] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const { socket } = useWebSocket(userId);
  const sendMessageMutation = useSendMessage(userId);

  const conversations = conversationsData?.data || [];
  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const otherParticipant = getOtherParticipant(conversation, userId);
      const participantName = otherParticipant?.name?.toLowerCase() || '';
      const serviceName = typeof conversation.service === 'object' ? conversation.service?.name?.toLowerCase() || '' : '';
      const lastMessage = getLastMessageText(conversation).toLowerCase();
      return participantName.includes(query) || serviceName.includes(query) || lastMessage.includes(query);
    });
  }, [conversations, search, userId]);

  useEffect(() => {
    if (!selectedConversationId && filteredConversations.length > 0) {
      setSelectedConversationId(filteredConversations[0]._id || filteredConversations[0].id || null);
    }
  }, [filteredConversations, selectedConversationId]);

  const selectedConversation = filteredConversations.find((conversation) => (conversation._id || conversation.id) === selectedConversationId) || null;
  const conversationId = selectedConversation?._id || selectedConversation?.id || '';
  const { data: messagesData, isLoading: messagesLoading } = useConversationMessages(conversationId);
  const messages = messagesData?.data || [];

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewMessage = (message: Message) => {
      const messageConversationId = typeof message.conversation === 'string'
        ? message.conversation
        : message.conversation?._id || message.conversation?.id;

      if (messageConversationId) {
        queryClient.invalidateQueries({ queryKey: ['conversation-messages', messageConversationId] });
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      }
    };

    const handleConversationUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('conversationUpdated', handleConversationUpdated);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('conversationUpdated', handleConversationUpdated);
    };
  }, [socket, queryClient]);

  const handleSend = async () => {
    if (!conversationId || !draft.trim()) {
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId,
      content: draft.trim(),
    });

    setDraft('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">Chat with customers and providers</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations"
                className="pl-9"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {conversationsLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-muted/30 animate-pulse h-20" />
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation, userId);
                const isSelected = (conversation._id || conversation.id) === selectedConversationId;

                return (
                  <button
                    key={conversation._id || conversation.id}
                    onClick={() => setSelectedConversationId(conversation._id || conversation.id || null)}
                    className={`w-full text-left p-4 border-b border-border transition-smooth ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-semibold">
                        {otherParticipant?.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground truncate">
                            {otherParticipant?.name || 'Conversation'}
                          </h3>
                          {!!conversation.unreadCount && conversation.unreadCount > 0 && (
                            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {getLastMessageText(conversation)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
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

        <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden min-h-[70vh] flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-semibold">
                  {getOtherParticipant(selectedConversation, userId)?.name?.charAt(0) || 'M'}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground truncate">
                    {getOtherParticipant(selectedConversation, userId)?.name || 'Conversation'}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedConversation.service && typeof selectedConversation.service === 'object'
                      ? selectedConversation.service.name
                      : 'Direct chat'}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
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
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMine ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
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
              </div>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-3 items-end">
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message..."
                    className="min-h-[56px] resize-none"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!draft.trim() || sendMessageMutation.isPending}
                    className="h-14 px-5"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <MessageSquare className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground">Select a conversation</h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Pick a thread from the list to read and send messages.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

