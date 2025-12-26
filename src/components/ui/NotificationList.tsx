import { useWebSocket } from "@/src/context/WebsocketContext";
import { useEffect } from "react";
import { NotificationItem } from "./NotificationItem";

type Props = {
    setUnread?: (unread: number) => void;
}

export const NotificationList = ({ setUnread }: Props) => {
    const { isConnected, messages } = useWebSocket();

    return (
        <div className="px-4">

            <div className="space-y-2 pb-2">
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
                            key={msg.notificationId ?? `${msg.itemId}-${msg.createdAt}-${msg.type}`}
                            itemId={msg.itemId}
                            type={msg.type}
                            itemName={msg.itemName}
                            claimer={msg.claimer}
                            claimScheduledTime={msg.claimScheduledTime}
                            createdAt={msg.createdAt}
                            status={msg.status}
                        />
                    ))
                )}
            </div>

        </div>
    );
};
