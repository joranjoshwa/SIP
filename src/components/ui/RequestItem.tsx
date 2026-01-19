"use client";

import Image from "next/image";
import { ImageOff, Check, X, Clock } from "lucide-react";
import { ItemStatus } from "@/src/enums/itemStatus";
import type { WithdrawalRequestItem, StatusRecovery } from "@/src/types/withdrawal";

type Props = {
    requestItem: WithdrawalRequestItem;
    itemStatus: string;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
};

export function RequestItem({
    requestItem,
    onApprove,
    onReject,
    itemStatus,
}: Props) {
    const handleApprove = () => onApprove?.(requestItem.id);
    const handleReject = () => onReject?.(requestItem.id);

    return (
        <div className="flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:bg-gray-100 dark:hover:bg-neutral-800">
            <div className="flex items-center gap-2">
                {requestItem.user.avatar ? (
                    <Image
                        src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + requestItem.user.avatar}
                        alt={requestItem.user.name}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                        <ImageOff className="h-5 w-5 text-zinc-400" />
                    </div>
                )}

                <div>
                    <p className="text-sm font-medium">{requestItem.user.name}</p>
                    <p className="flex gap-1 text-xs text-gray-500">
                        <Clock className="h-[14px] w-[14px]" />
                        {requestItem.date}
                    </p>
                </div>
            </div>

            {requestItem.status === "PENDING" &&
                itemStatus === ItemStatus.DISPONIBLE && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleReject}
                            className="text-red-600 hover:text-red-800"
                            aria-label="Rejeitar pedido"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        <button
                            type="button"
                            onClick={handleApprove}
                            className="text-green-600 hover:text-green-800"
                            aria-label="Aprovar pedido"
                        >
                            <Check className="h-8 w-8" />
                        </button>
                    </div>
                )}

            {requestItem.status === "APPROVED" && (
                <span className="text-sm text-green-600">Pedido aceito</span>
            )}
            {requestItem.status === "REFUSED" && (
                <span className="text-sm text-red-600">Pedido recusado</span>
            )}
        </div>
    );
}
