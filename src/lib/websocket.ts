import io from 'socket.io-client';
import { useEffect, useState } from 'react';

// Define types for the events and data structures
export interface MessageData {
  conversationId: string;
  content: string;
  recipientId: string;
}

export interface BookingStatusData {
  bookingId: string;
  status: string;
  providerId: string;
}

export interface TypingData {
  conversationId: string;
}

export interface NotificationData {
  recipientId: string;
  type: string;
  title: string;
  message: string;
}

export interface BookingData {
  _id: string;
  customer: {
    name: string;
    _id: string;
  };
  provider: string;
  service: {
    name: string;
  };
  date: string;
  time: string;
}

export interface AvailabilityData {
  providerId: string;
  date: string;
  availability: any; // Define more specific type based on your needs
}

// Define the events map for type safety
export interface ClientToServerEvents {
  sendMessage: (data: MessageData) => void;
  bookingStatusUpdate: (data: BookingStatusData) => void;
  typingStart: (data: TypingData) => void;
  typingStop: (data: TypingData) => void;
  setOnline: () => void;
  setOffline: () => void;
  sendNotification: (data: NotificationData) => void;
  bookingCreated: (booking: BookingData) => void;
  availabilityUpdate: (data: AvailabilityData) => void;
}

export interface ServerToClientEvents {
  messageSent: (message: any) => void;
  newMessage: (message: any) => void;
  conversationUpdated: (conversations: any[]) => void;
  bookingStatusChanged: (data: { bookingId: string; status: string; message: string }) => void;
  userTyping: (data: { userId: string; conversationId: string }) => void;
  userStoppedTyping: (data: { userId: string; conversationId: string }) => void;
  userOnline: (data: { userId: string }) => void;
  userOffline: (data: { userId: string }) => void;
  userStatusChanged: (data: { userId: string; isActive: boolean }) => void;
  newNotification: (notification: any) => void;
  newBookingRequest: (data: {
    bookingId: string;
    customerName: string;
    service: string;
    date: string;
    time: string;
  }) => void;
  bookingConfirmed: (data: { bookingId: string; message: string }) => void;
  providerAvailabilityChanged: (data: {
    providerId: string;
    date: string;
    availability: any;
  }) => void;
  error: (error: { message: string }) => void;
}

// Using any for socketInstance due to socket.io-client v4 type compatibility issues
// The functionality remains the same, types will be enforced through IDE autocomplete
let socketInstance: any | null = null;

// For WebSocket, we need the actual backend URL, not the proxy
// In production, use VITE_WS_URL from environment
// In development, fallback to localhost
const BACKEND_URL = import.meta.env.VITE_WS_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : 'https://your-production-backend.com');

export const initializeWebSocket = (userId: string, token: string | null) => {
  if (socketInstance) {
    return socketInstance;
  }

  // Don't initialize if no token available
  if (!token) {
    console.warn('Cannot initialize WebSocket: No authentication token available');
    return null;
  }

  socketInstance = io(BACKEND_URL, {
    auth: {
      token: token  // Send JWT token for authentication
    },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  socketInstance.on('connect', () => {
    console.log('Connected to WebSocket server:', socketInstance?.id);
    // Join user-specific rooms after connection
    if (userId) {
      socketInstance?.emit('joinUserRoom', { userId });
    }
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('Disconnected from WebSocket server:', reason);
    socketInstance = null;
  });

  socketInstance.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socketInstance;
};

export const getSocket = () => {
  return socketInstance;
};

export const disconnectWebSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

// React hook to manage WebSocket connection
export const useWebSocket = (token: string | null, userId: string | null) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Need both userId and token to connect
    if (!userId || !token) {
      if (socketInstance) {
        disconnectWebSocket();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = initializeWebSocket(userId, token);
    if (!newSocket) {
      console.warn('Failed to initialize WebSocket - no token available');
      return;
    }

    setSocket(newSocket);
    setIsConnected(newSocket.connected);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      // Only disconnect if this is the same instance
      if (newSocket === socketInstance) {
        disconnectWebSocket();
      }
    };
  }, [userId, token]); // Depend on both userId and token

  return { socket, isConnected };
};