"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { NotificationList } from "@/src/components/ui/NotificationList";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { useWebSocket } from "@/src/context/WebsocketContext";
import { markAsRead } from "@/src/api/endpoints/notification";

export default function Notification() {
    const { messages, setMessages } = useWebSocket();
    const [ prevRead, setPrevRead ] = useState(0);

    const unread = useMemo(
        () => messages.filter((m) => m.status === "PENDING").length,
        [messages]
    );

    const ranRef = useRef(false);

    useEffect(() => {
        if (ranRef.current) return;
        ranRef.current = true;
        setPrevRead(unread);

        const ids = messages
            .filter((m) => m.status === "PENDING" && m.notificationId)
            .map((m) => m.notificationId as string);

        if (ids.length === 0) return;

        void markAsRead(ids);

        const idSet = new Set(ids);
        setMessages((prev) =>
            prev.map((item) =>
                item.notificationId && idSet.has(item.notificationId)
                    ? { ...item, status: "READ" as const }
                    : item
            )
        );
    }, [messages, setMessages]);

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 min-h-0">
            <PageHeader
                title={`Notificações (${prevRead})`}
                showBell={true}
                className="px-5 mb-0"
            />

            <main className="flex flex-col min-h-0">
                <ScrollableArea>
                    <NotificationList />
                </ScrollableArea>
            </main>
        </div>
    );
}
