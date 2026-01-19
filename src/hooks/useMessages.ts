// src/hooks/useMessages.ts
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Conversation, Message } from '@/lib/apiTypes';
import { useWebSocket } from '@/lib/websocket';
import { useAuth } from '../contexts/AuthContext'; // Updated import

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.messages.getConversations(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => api.messages.getMessages(conversationId),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useMessagesWithUser = (userId: string) => {
  return useQuery({
    queryKey: ['messagesWithUser', userId],
    queryFn: () => api.messages.getMessagesWithUser(userId),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: () => api.messages.getUnreadCount(),
    staleTime: 10 * 1000, // 10 seconds
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

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { token, userId } = useAuth(); // Updated to get userId from Auth context

  // Initialize WebSocket connection with proper userId
  const { socket } = useWebSocket(token, userId);

  return useMutation({
    mutationFn: (messageData: { conversationId: string; content: string }) =>
      api.messages.sendMessage(messageData),
    onSuccess: (data, variables) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });

      // Note: WebSocket notifications are handled by the backend after the message is saved
      // The backend will emit 'newMessage' events to both sender and recipient
      // This prevents duplicate messages and ensures consistent state
    },
  });
};

// New hook for real-time message updates
export const useRealTimeMessages = (conversationId: string) => {
  const queryClient = useQueryClient();
  const { token, userId } = useAuth();

  // Initialize WebSocket connection with proper userId
  const { socket } = useWebSocket(token, userId);

  // Set up WebSocket event listeners
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (message: Message) => {
      // Update the messages query to include the new message
      queryClient.setQueryData(['messages', conversationId], (oldData: ApiResponse<Message[]> | undefined) => {
        if (!oldData) return { data: [message] };
        return {
          ...oldData,
          data: [...oldData.data, message]
        };
      });
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);

  // Set up WebSocket event listeners for conversation updates
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = (conversations: Conversation[]) => {
      queryClient.setQueryData(['conversations'], () => ({
        data: conversations
      }));
    };

    socket.on('conversationUpdated', handleConversationUpdated);

    return () => {
      socket.off('conversationUpdated', handleConversationUpdated);
    };
  }, [socket, queryClient]);
};