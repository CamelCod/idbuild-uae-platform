import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // For GitHub Pages demo, use mock socket connection
    // In production, this would connect to the actual backend
    const mockSocket = {
      on: (event: string, callback: Function) => {
        if (event === 'connect') {
          setTimeout(() => callback(), 100);
        }
      },
      emit: (event: string, data: any) => {
        console.log(`Mock emit: ${event}`, data);
      },
      disconnect: () => {},
    } as unknown as Socket;

    setSocket(mockSocket);
    setIsConnected(true);

    return () => {
      mockSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};