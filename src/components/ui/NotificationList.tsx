import { useWebSocket } from "@/src/context/WebsocketContext";
import { useEffect } from "react";
import { NotificationItem } from "./NotificationItem";

type Props = {
    setUnread: (unread: number) => void;
}

export const NotificationList = ({ setUnread }: Props) => {
    const { isConnected, messages, error, clearMessages, markAsRead } = useWebSocket();

    useEffect(() => {
        setUnread(messages.filter((msg) => msg.content?.isNew).length);
    }, [messages, setUnread]);

    return (
        <div className="space-y-4 p-4">

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
                            key={`${index}-${msg.content.id}-${new Date().getMilliseconds()}`}
                            id={msg.content.id}
                            type={msg.content.type}
                            itemName={msg.content.itemName}
                            claimer={msg.content.claimer}
                            claimScheduledTime={msg.content.claimScheduledTime}
                            createdAt={msg.createdAt}
                            isNew={msg.content.isNew}
                            onClick={() => markAsRead(msg.content.id, msg.email as string)}
                        />
                    ))
                )}
            </div>

        </div>
    );
};
