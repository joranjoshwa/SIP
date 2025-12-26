export type Channel = "admin" | "common";
export type NotificationType = "NEW_REQUEST" |
    "REQUEST_REFUSED" |
    "RECEIVED" |
    "REQUEST_APPROVED" |
    "REQUEST_REFUSED_ANOTHER_USER" |
    "NEW_ITEM_ON_CHARITY" |
    "NEW_ITEM_CREATED";

export type NotificationStatus = "PENDING" | "READ";

export type Role = "admin" | "common";

export interface Notification {
    id: string;
    content: NotificationContent;
    channel: 'Admin' | 'User';
    timestamp: string;
}

export interface WebSocketContextValue {
    isConnected: boolean;
    messages: NotificationContent[];
    error: string;
    clearMessages: () => void;
    reconnect: () => void;
    setMessages: React.Dispatch<React.SetStateAction<NotificationContent[]>>;
}

export type NotificationContent = {
    notificationId?: string,
    itemId: string;
    type: NotificationType;
    itemName: string;
    claimer?: string,
    claimScheduledTime?: string;
    status?: NotificationStatus;
    createdAt: number;
};

export type ClaimTime = {
    date: string;
    time: string;
};

export type NotificationTemplateVars = {
    itemDescription: string;
    pickupDate?: string;
    pickupTime?: string;
    claimerName?: string;
};

export type NotificationDTO = {
    notificationId: string;
    itemId: string;
    type: NotificationType;
    claimScheduledTime: string | null;
    claimer: string | null;
    itemName: string;
    status: NotificationStatus;
    createdAt: string,
};

export type NotificationListDTO = NotificationDTO[];
