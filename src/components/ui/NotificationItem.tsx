import Link from "next/link";
import { NotificationType, NotificationTemplateVars, NotificationContent, ClaimTime } from "@/src/types/notification";

export type Props = NotificationContent & {
    onClick?: () => void;
}

export function formatRelativeTime(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return "agora";
    if (diffMin === 1) return "há 1 min";
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHours === 1) return "há 1 hora";
    if (diffHours < 24) return `há ${diffHours} horas`;
    if (diffDays === 1) return "há 1 dia";
    return `há ${diffDays} dias`;
}

export function getClaimTimeParts(claimScheduledTime: string): ClaimTime {
    const d = new Date(claimScheduledTime);

    if (isNaN(d.getTime())) {
        return { date: "", time: "" };
    }

    const date = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const time = d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return { date, time };
}

const notificationTemplates: Record<
    NotificationType,
    (vars: NotificationTemplateVars) => { title: string; message: string }
> = {
    NEW_REQUEST: ({ itemDescription, claimerName }) => ({
        title: "Nova solicitação de reivindicação criada!",
        message: `${claimerName} enviou um pedido de recuperar o item "${itemDescription}". Análise a solicitação!`
    }),

    RECEIVED: ({ itemDescription }) => ({
        title: "Solicitação de reivindicação recebida!",
        message: `A CAENS recebeu o seu pedido de recuperar o item "${itemDescription}". Aguarde retorno!`
    }),

    REQUEST_APPROVED: ({ itemDescription, pickupDate, pickupTime }) => ({
        title: "Solicitação de reivindicação aprovada!",
        message: `Vá às ${pickupTime} do dia ${pickupDate} para buscar o item "${itemDescription}" na CAENS Não se atrase!`
    }),

    REQUEST_REFUSED: ({ itemDescription }) => ({
        title: "Solicitação de reivindicação recusada!",
        message: `Sua solicitação de reivindicar "${itemDescription}" foi recusada. Entre em contato com a CAENS para receber mais informações ou contestar essa decisão.`
    }),

    REQUEST_REFUSED_ANOTHER_USER: ({ itemDescription }) => ({
        title: "Solicitação de reivindicação recusada!",
        message: `Sua solicitação de reivindicar "${itemDescription}" foi recusada. Entre em contato com a CAENS para receber mais informações ou contestar essa decisão.`
    }),

    NEW_ITEM_ON_CHARITY: ({ itemDescription }) => ({
        title: "Novo item para caridade!",
        message: `Novo item para caridade: "${itemDescription}". Se este item te pertence, entre em contato com a CAENS.`
    }),

    NEW_ITEM_CREATED: ({ itemDescription }) => ({
        title: "Novo item criado!",
        message: `Novo item criado: "${itemDescription}". Confira se este item te pertence.`
    }),
};


export const NotificationItem = ({ itemId, type, itemName, createdAt, status, onClick, claimer, claimScheduledTime }: Props) => {
    const refused = type === "REQUEST_REFUSED_ANOTHER_USER" || type === "REQUEST_REFUSED";
    const formattedTime = createdAt ? formatRelativeTime(new Date(createdAt).toISOString()) : "";
    const { date, time } = getClaimTimeParts(claimScheduledTime as string);

    return (
        <Link href={`/dashboard/items/${itemId}`} className="border-b block border-gray-200 dark:border-neutral-700 py-3 px-2" onClick={onClick}>

            <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                    <span className={`mt-2 h-2 w-2 rounded-full flex-shrink-0 ${refused ? "bg-red-500" : "bg-green-500"}`}></span>
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100 text-sm">
                        {notificationTemplates[type]({
                            itemDescription: itemName,
                        }).title}
                    </h4>
                </div>
                <p className="text-gray-600 dark:text-neutral-300 text-sm">
                    {notificationTemplates[type]({
                        itemDescription: itemName, claimerName: claimer,
                        pickupDate: date || "01/01/1900",
                        pickupTime: time || "00:00"
                    }).message}
                </p>
                {createdAt && (
                    <span className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                        {formattedTime}
                    </span>
                )}
            </div>

        </Link>
    );
}

