import { ItemStatus } from "../enums/itemStatus";

export const StatusLabels: Record<ItemStatus, string> = {
    [ItemStatus.DISPONIBLE]: "Disponível",
    [ItemStatus.CLAIMED]: "Reivindicado",
    [ItemStatus.CHARITY]: "Doado",
};
