"use client";

import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { extractRoleFromToken } from '../utils/token';
import { Channel, WebSocketContextValue, NotificationContent, NotificationDTO } from '../types/notification';
import { getNotificationOfUser } from '../api/endpoints/notification';

interface WebSocketProviderProps {
    children: React.ReactNode;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);
const MESSAGE_TTL_MS = 2 * 3600 * 1000; //duas horas

const filterValidMessages = (messages: NotificationContent[]): NotificationContent[] => {
    const now = Date.now();
    return messages.filter((m) => now - m.createdAt < MESSAGE_TTL_MS);
};

export function dtoToNotificationContent(
    dto: NotificationDTO,
): NotificationContent {
    const content: NotificationContent = {
        notificationId: dto.notificationId,
        itemId: dto.itemId,
        type: dto.type,
        itemName: dto.itemName,
        status: dto.status,
        createdAt: new Date(dto.createdAt).getTime(),
    };

    if (dto.claimer) content.claimer = dto.claimer;
    if (dto.claimScheduledTime) content.claimScheduledTime = dto.claimScheduledTime;

    return content;
}

export function dtosToNotificationContent(
    dtos: NotificationDTO[],
    receivedAt: number = Date.now()
): NotificationContent[] {
    return dtos.map((d) => dtoToNotificationContent(d));
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
    children,
    autoReconnect = true,
    reconnectInterval = 3000
}) => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<NotificationContent[]>([]);
    const [error, setError] = useState('');
    const [token, setToken] = useState<string>("");
    const [channel, setChannel] = useState<Channel | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const shouldReconnectRef = useRef(true);
    const mountedRef = useRef(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessages((prev) => filterValidMessages(prev));
        }, 30_000);

        return () => clearInterval(interval);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            const messages = await getNotificationOfUser();
            setMessages(dtosToNotificationContent(messages));
        };

        fetchNotifications();
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
                    const { createdAt, ...rest } = data;
                    const incoming: NotificationContent = {
                        ...rest,
                        createdAt: new Date(createdAt).getTime(),
                    };

                    setMessages((prev) => {
                        if (!Array.isArray(prev)) console.warn("messages state corrompido:", prev);
                        const safePrev = Array.isArray(prev) ? prev : [];
                        return [incoming, ...safePrev];
                    });

                    console.log(incoming);
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
                setMessages,
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