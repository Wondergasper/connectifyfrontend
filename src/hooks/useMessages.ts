import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Message } from '@/lib/apiTypes';
import { useWebSocket } from '@/lib/websocket';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.messages.getConversations(),
  });
};

export const useConversationMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => api.messages.getMessages(conversationId),
    enabled: !!conversationId,
  });
};

export const useConversationMessagesWithUser = (userId: string) => {
  return useQuery({
    queryKey: ['messages-with-user', userId],
    queryFn: () => api.messages.getMessagesWithUser(userId),
    enabled: !!userId,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['messages-unread-count'],
    queryFn: () => api.messages.getUnreadCount(),
  });
};

export const useSearchConversations = (search: string) => {
  return useQuery({
    queryKey: ['search-conversations', search],
    queryFn: () => api.messages.searchConversations(search),
    enabled: !!search,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationData: { recipientId: string; serviceId?: string; bookingId?: string }) =>
      api.messages.createConversation(conversationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useSendMessage = (userId: string | null) => {
  const queryClient = useQueryClient();
  useWebSocket(userId);

  return useMutation({
    mutationFn: (messageData: { conversationId: string; content: string }) =>
      api.messages.sendMessage(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-messages'] });
    },
  });
};

export const useRealTimeMessages = (userId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useWebSocket(userId);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  return messages;
};

export const useMessageSocket = useWebSocket;



