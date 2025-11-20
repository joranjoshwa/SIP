"use client";

import { ArrowLeft, Bell } from "lucide-react";
import { NotificationItem } from "../../../../components/ui/NotificationItem";

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
        <div className="flex flex-col h-screen bg-white dark:bg-neutral-900">

            <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-neutral-200" />
                    <h2 className="font-semibold text-gray-900 dark:text-neutral-100">
                        Notificações ({notifications.length})
                    </h2>
                </div>
                <Bell className="w-5 h-5 text-gray-700 dark:text-neutral-200" />
            </header>

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