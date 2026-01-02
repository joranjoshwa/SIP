import { RecoveryStatus } from "../enums/recoveryStatus";

export const RecoveryLabels: Record<RecoveryStatus, string> = {
    [RecoveryStatus.PENDING]: "Pendente",
    [RecoveryStatus.APPROVED]: "Aceito",
    [RecoveryStatus.REFUSED]: "Rejeitado",
};
