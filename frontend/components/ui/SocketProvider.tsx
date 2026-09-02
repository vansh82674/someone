'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// 1. Define Shape of our context state
interface SocketContextType {
    socket: Socket | null,
    isConnected: boolean
}

// 2. Initialise context with proper type
const SocketContext = createContext<SocketContextType | null>(null)

// 3. Type the children prop

export const SocketProvider = ({ children }: { children: ReactNode }) => {

    // 4. Type the Socket State
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io('http://localhost:8081', {
            autoConnect: true,
            transports: ['websocket'], // Forces WebSocket transport for performance
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        // Cleanup: disconnect when the provider unmounts to prevent dangling connections
        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook for easier consumption in child components
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
