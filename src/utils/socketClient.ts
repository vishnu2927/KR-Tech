import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    try {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin.replace(':5173', ':5000').replace(':8443', ':5000');
      socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        timeout: 10000,
        autoConnect: true,
      });

      socket.on('connect', () => {
        console.log('⚡ Socket.IO Connected:', socket?.id);
      });

      socket.on('connect_error', (err) => {
        console.warn('⚠️ Socket.IO connection notice (will use graceful polling fallback):', err.message);
      });
    } catch (err) {
      console.warn('Could not initialize Socket.IO:', err);
    }
  }

  return socket;
};

export const joinRoom = (roomId: string) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('join_room', roomId);
  }
};

export const leaveRoom = (roomId: string) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('leave_room', roomId);
  }
};

export const emitTyping = (roomId: string, userName: string) => {
  const s = getSocket();
  if (s && s.connected) {
    s.emit('typing', { roomId, userName });
  }
};
