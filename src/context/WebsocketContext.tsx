"use client";

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { extractRoleFromToken } from '../utils/token';
import { Channel, WebSocketContextValue, NotificationMessage } from '../types/notification';
import { IncomingMessage } from 'http';

interface WebSocketProviderProps {
    children: React.ReactNode;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);
const STORAGE_KEY = "sip_notifications";
const MESSAGE_TTL_MS = 2 * 3600 * 1000; //duas horas

const filterValidMessages = (messages: NotificationMessage[]): NotificationMessage[] => {
    const now = Date.now();
    return messages.filter((m) => now - m.receivedAt < MESSAGE_TTL_MS);
};

const normalizeMessages = (messages: NotificationMessage[]): NotificationMessage[] => {
    const valid = filterValidMessages(messages);

    const byId = new Map<string, NotificationMessage>();

    for (const msg of valid) {
        const key = `${msg.content.id}-${msg.email}`;
        const existing = byId.get(key);

        if (!existing || msg.receivedAt > existing.receivedAt) {
            byId.set(key, msg);
        }
    }

    return Array.from(byId.values()).sort(
        (a, b) => b.receivedAt - a.receivedAt
    );
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children,
    autoReconnect = true,
    reconnectInterval = 3000
}) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<NotificationMessage[]>([]);
    const [error, setError] = useState('');
    const [token, setToken] = useState<string>("");
    const [channel, setChannel] = useState<Channel | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shouldReconnectRef = useRef(true);
    const mountedRef = useRef(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed: NotificationMessage[] = JSON.parse(raw);
            setMessages(normalizeMessages(parsed));
        } catch (e) {
            setError("Failed to parse notifications from localStorage " + e);
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const valid = filterValidMessages(messages);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessages((prev) => filterValidMessages(prev));
        }, 30_000);

        return () => clearInterval(interval);
    }, []);

    const markAsRead = useCallback((id: string, email: string) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.content.id === id && msg.email === email
                    ? {
                        ...msg,
                        content: {
                            ...msg.content,
                            isNew: false,
                        },
                    }
                    : msg
            )
        );
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = window.localStorage.getItem("token");
            setToken(storedToken as string);

            if (storedToken) {
                const extractedRole = extractRoleFromToken(storedToken)?.toLowerCase() as Channel;
                setChannel(extractedRole);
            }
        }
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

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
                setIsConnected(true);
                setError('');
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const { content, ...notificationData } = data;
                    const contentParsed = JSON.parse(content);
                    const incoming: NotificationMessage = {
                        content: { ...contentParsed, isNew: true },
                        ...notificationData,
                        receivedAt: Date.now(),
                    };

                    setMessages((prev) => normalizeMessages([incoming, ...prev]));
                } catch (e) {
                    setError("Error parsing message: " + e);
                }
            };

            ws.onerror = (error) => {
                if (mountedRef.current) {
                    setError('Connection error occurred');
                }
            };

            ws.onclose = (event) => {

                if (!mountedRef.current) return;

                setIsConnected(false);
                wsRef.current = null;

                if (event.code === 1006) {
                    setError('Connection closed unexpectedly. Attempting to reconnect...');
                } else if (event.code === 1002) {
                    setError('Connection closed due to protocol error.');
                } else if (event.code === 1008) {
                    setError('Connection closed: Invalid token or unauthorized.');
                } else if (!event.wasClean) {
                    setError('Connection lost. Attempting to reconnect...');
                }

                if (autoReconnect && shouldReconnectRef.current && event.code !== 1008) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (mountedRef.current && shouldReconnectRef.current) {
                            connect();
                        }
                    }, reconnectInterval);
                }
            };

            wsRef.current = ws;

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError('Failed to connect: ' + errorMessage);
            setIsConnected(false);

            if (autoReconnect && shouldReconnectRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (mountedRef.current) {
                        connect();
                    }
                }, reconnectInterval);
            }
        }
    }, [wsUrl, token, channel, autoReconnect, reconnectInterval]);

    const reconnect = useCallback(() => {
        shouldReconnectRef.current = true;
        connect();
    }, [connect]);

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
                reconnect,
                markAsRead
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};