"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { extractRoleFromToken } from "@/src/utils/token";
import { NotificationList } from "@/src/components/ui/NotificationList";
import { Role } from "@/src/types/notification";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";


export default function Notification() {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [unread, setUnread] = useState<number>(0);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = window.localStorage.getItem("token");
            setToken(storedToken);

            if (storedToken) {
                const extractedRole = extractRoleFromToken(storedToken)?.toLowerCase() as Role;
                setRole(extractedRole);
            }
        }
    }, []);

    if (!token || !role) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-neutral-900">
                <p>Carregando notificações...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 min-h-0">
            <PageHeader title={`Notificações (${unread})`} showBell={true} className="px-5 mb-0" />

            <main className="flex-1 min-h-0">
                <ScrollableArea>
                    <NotificationList setUnread={setUnread} />
                </ScrollableArea>
            </main>
        </div>
    );
}