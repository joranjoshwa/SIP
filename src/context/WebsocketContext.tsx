"use client";

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { extractRoleFromToken } from '../utils/token';

type Channel = "admin" | "common";
// Tipos TypeScript para melhor type safety
interface Notification {
    id: string;
    content: {
        id: string,
        title: string,
        message: string,
        time: string,
        isNew: boolean
    };
    channel: 'Admin' | 'User';
    timestamp: string;
}

interface WebSocketContextValue {
    isConnected: boolean;
    messages: Notification[];
    error: string;
    clearMessages: () => void;
    reconnect: () => void;
}

interface WebSocketProviderProps {
    children: React.ReactNode;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children,
    autoReconnect = true,
    reconnectInterval = 3000
}) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<Notification[]>([]);
    const [error, setError] = useState('');
    const [token, setToken] = useState<string>("");
    const [channel, setChannel] = useState<Channel | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shouldReconnectRef = useRef(true);
    const mountedRef = useRef(true);

    // Função para limpar mensagens
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    useEffect(() => {
        // This only runs in the browser
        if (typeof window !== "undefined") {
            const storedToken = window.localStorage.getItem("token");
            setToken(storedToken as string);

            if (storedToken) {
                // If your extractRoleFromToken expects the token, pass it here
                const extractedRole = extractRoleFromToken(storedToken)?.toLowerCase() as Channel;
                setChannel(extractedRole);
                console.log(channel);
            }
        }
    }, []);

    // Função para criar conexão
    const connect = useCallback(() => {
        // Limpar conexão anterior se existir
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Limpar timeout de reconexão anterior
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        const endpoint = channel === 'admin'
            ? `${wsUrl}/admin?access_token=${encodeURIComponent(token)}`
            : `${wsUrl}/common?access_token=${encodeURIComponent(token)}`;

        try {
            if (!token) return;
            const ws = new WebSocket(endpoint);

            ws.onopen = () => {
                if (!mountedRef.current) return;
                console.log('WebSocket connected');
                setIsConnected(true);
                setError('');
            };

            ws.onmessage = (event) => {
                if (!mountedRef.current) return;

                try {
                    const data = JSON.parse(event.data);
                    const content = JSON.parse(data.content);
                    const notification: Notification = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        content: content,
                        channel: data.isAdmin ? 'Admin' : 'User',
                        timestamp: new Date().toISOString(),
                    };
                    setMessages((prevMessages) => [notification, ...prevMessages]);
                } catch (e) {
                    console.error('Error parsing message:', e);
                    const notification: Notification = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        content: event.data,
                        channel: channel === 'admin' ? 'Admin' : 'User',
                        timestamp: new Date().toISOString(),
                    };
                    setMessages((prevMessages) => [notification, ...prevMessages]);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (mountedRef.current) {
                    setError('Connection error occurred');
                }
            };

            ws.onclose = (event) => {
                console.log('WebSocket closed:', event.code, event.reason);

                if (!mountedRef.current) return;

                setIsConnected(false);
                wsRef.current = null;

                // Mensagens de erro específicas por código
                if (event.code === 1006) {
                    setError('Connection closed unexpectedly. Attempting to reconnect...');
                } else if (event.code === 1002) {
                    setError('Connection closed due to protocol error.');
                } else if (event.code === 1008) {
                    setError('Connection closed: Invalid token or unauthorized.');
                } else if (!event.wasClean) {
                    setError('Connection lost. Attempting to reconnect...');
                }

                // Reconexão automática
                if (autoReconnect && shouldReconnectRef.current && event.code !== 1008) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (mountedRef.current && shouldReconnectRef.current) {
                            console.log('Attempting to reconnect...');
                            connect();
                        }
                    }, reconnectInterval);
                }
            };

            wsRef.current = ws;

        } catch (err) {
            console.error('Failed to connect:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError('Failed to connect: ' + errorMessage);
            setIsConnected(false);

            // Tentar reconectar em caso de erro
            if (autoReconnect && shouldReconnectRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (mountedRef.current) {
                        connect();
                    }
                }, reconnectInterval);
            }
        }
    }, [wsUrl, token, channel, autoReconnect, reconnectInterval]);

    // Função de reconexão manual
    const reconnect = useCallback(() => {
        shouldReconnectRef.current = true;
        connect();
    }, [connect]);

    // Conectar quando o componente monta ou quando dependências mudam
    useEffect(() => {
        mountedRef.current = true;
        shouldReconnectRef.current = true;
        connect();

        return () => {
            mountedRef.current = false;
            shouldReconnectRef.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [connect]);

    return (
        <WebSocketContext.Provider
            value={{
                isConnected,
                messages,
                error,
                clearMessages,
                reconnect
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

// Hook customizado para usar o WebSocket context
export const useWebSocket = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};