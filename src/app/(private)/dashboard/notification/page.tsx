"use client";

import { ArrowLeft, Bell } from "lucide-react";
import { NotificationItem } from "../../../../components/ui/NotificationItem";
import { PageHeader } from "@/src/components/ui/PageHeader";

export default function Notification() {
    const notifications = [
        {
            id: 1,
            title: "Solicitação de reivindicação recebida!",
            message:
                'Ana Castelo enviou um pedido de recuperar o item "Garrafa de água preta e transparente...". Analise a solicitação!',
            time: "há 5 min",
            isNew: true,
        },
        {
            id: 2,
            title: "Solicitação de reivindicação recebida!",
            message:
                'Ana Castelo enviou um pedido de recuperar o item "Garrafa de água preta e transparente...". Analise a solicitação!',
            time: "há 20 min",
        },
        {
            id: 3,
            title: "Solicitação de reivindicação recebida!",
            message:
                'Ana Castelo enviou um pedido de recuperar o item "Garrafa de água preta e transparente...". Analise a solicitação!',
            time: "há 1 hora",
        },
    ];

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 px-3">
            <PageHeader title={`Notificações (${notifications.length})`}  />

            <main className="flex-1 overflow-y-auto">
                {notifications.map((n) => (
                    <NotificationItem
                        key={n.id}
                        title={n.title}
                        message={n.message}
                        time={n.time}
                        isNew={n.isNew}
                    />
                ))}
            </main>

        </div>
    );
}