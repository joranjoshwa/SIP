export type Channel = "admin" | "common";
export type NotificationType = "new" | "refused" | "received" | "approved";
export type Role = "admin" | "common";

export interface Notification {
    id: string;
    content: NotificationContent;
    channel: 'Admin' | 'User';
    timestamp: string;
}

export interface WebSocketContextValue {
    isConnected: boolean;
    messages: NotificationMessage[];
    error: string;
    clearMessages: () => void;
    reconnect: () => void;
    markAsRead: (id: string, email: string) => void;
}

export type NotificationContent = {
    id: string;
    type: NotificationType;
    itemName: string;
    claimer?: string,
    claimScheduledTime?: string;
    isNew?: boolean;
};

export type NotificationMessage = {
    content: NotificationContent;
    isAdmin?: boolean;
    channel: 'Admin' | 'User';
    email?: string;
    receivedAt: number;
    createdAt: string;
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