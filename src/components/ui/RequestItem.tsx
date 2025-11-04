import Image from "next/image";
import { Check, X, Clock } from "lucide-react";
import { ItemStatus } from "@/src/enums/itemStatus";

type Props = {
    requestItem: ItemRequest;
    itemStatus: string;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
};

export function RequestItem({ requestItem, onApprove, onReject, itemStatus }: Props) {
    return (
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex items-center gap-2">
                <Image
                    src={requestItem.user.avatar}
                    alt={requestItem.user.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                />
                <div>
                    <p className="text-sm font-medium">{requestItem.user.name}</p>
                    <p className="text-xs text-gray-500 flex gap-1"><Clock className="h-[14px] w-[14px]"/>{requestItem.date}</p>
                </div>
            </div>

            {requestItem.status === "PENDING" && itemStatus === ItemStatus.DISPONIBLE && (
                <div className="flex gap-2">
                    <button
                        className="text-red-600 hover:text-red-800"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <button
                        className="text-green-600 hover:text-green-800"
                    >
                        <Check className="w-8 h-8" />
                    </button>
                </div>
            )}

            {requestItem.status === "APPROVED" && (
                <span className="text-green-600 text-sm">Pedido aceito</span>
            )}
            {requestItem.status === "REJECTED" && (
                <span className="text-red-600 text-sm">Pedido recusado</span>
            )}
        </div>
    );
}
