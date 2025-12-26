import { api } from "../axios";
import { NotificationDTO } from "@/src/types/notification";

export const getNotificationOfUser = async ():Promise<NotificationDTO[]> => {
    const notifications: NotificationDTO[] = await api.get(
        "/notification/byUser"
    ).then(r => r.data);

    return notifications;
}

export const markAsRead = async (payload: string[]):Promise<void> => {
    await api.patch("/notification/read", payload);
}