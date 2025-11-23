"use client";

import { useEffect, useState } from "react";
import { NotificationItem } from "@/src/components/ui/NotificationItem";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { useWebSocket, WebSocketProvider } from "@/src/context/WebsocketContext";
import { extractRoleFromToken } from "@/src/utils/token";

type Role = "admin" | "common";
type Props = {
    setUnread: (unread: number) => void;
}

export default function Notification() {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [unread, setUnread] = useState<number>(0);

    useEffect(() => {
        // This only runs in the browser
        if (typeof window !== "undefined") {
            const storedToken = window.localStorage.getItem("token");
            setToken(storedToken);

            if (storedToken) {
                // If your extractRoleFromToken expects the token, pass it here
                const extractedRole = extractRoleFromToken(storedToken)?.toLowerCase() as Role;
                setRole(extractedRole);
                console.log(role);
            }
        }
    }, []);

    // You can show a loading state while we don't have token/role
    if (!token || !role) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-neutral-900">
                <p>Carregando notificações...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 px-3">
            <PageHeader title={`Notificações (${unread})`} />

            <main className="flex-1 overflow-y-auto">
                <NotificationList setUnread={setUnread} />
            </main>
        </div>
    );
}

const NotificationList = ({ setUnread }: Props) => {
    const { isConnected, messages, error, clearMessages } = useWebSocket();

    useEffect(() => {
        setUnread(messages.filter((msg) => msg.content?.isNew).length);
    }, [messages, setUnread]);

    return (
        <div className="space-y-4 p-4">

            {/* Lista de notificações */}
            <div className="space-y-2">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-[60vh] text-center">
                        {isConnected ? (
                            <div>
                                <img src="/mail.gif" alt="gif para notificações" />
                                <p>

                                    Pronto para receber notificações?
                                </p>
                            </div>
                        ) : (
                            <p className="bg-[#F9D0D0] dark:bg-[#570000] p-2 rounded-lg">Você não parece estar conectado! Hmmmm...</p>
                        )}
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <NotificationItem
                            key={msg.content.id}
                            id={msg.content.id}
                            title={msg.content.title}
                            message={msg.content.message}
                            time={msg.content.time}
                            isNew={msg.content.isNew}
                        />
                    ))
                )}
            </div>

        </div>
    );
};
