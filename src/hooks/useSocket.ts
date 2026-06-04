import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeWebSocket, ServerToClientEvents } from '@/lib/websocket';

/**
 * A declarative hook for subscribing to Socket.IO events.
 * Handles subscription and cleanup automatically.
 * 
 * @param event The event name to subscribe to
 * @param callback The function to call when the event occurs
 */
export function useSocketEvent<K extends keyof ServerToClientEvents>(
  event: K,
  callback: ServerToClientEvents[K]
) {
  const { userId } = useAuth();

  useEffect(() => {
    if (!userId) return;

    const socket = initializeWebSocket(userId);
    
    // Subscribe
    socket.on(event, callback);

    // Cleanup
    return () => {
      socket.off(event, callback);
    };
  }, [event, callback, userId]);
}

/**
 * Hook to get the raw socket instance and connection status.
 */
export { useWebSocket as useSocketStatus } from '@/lib/websocket';
