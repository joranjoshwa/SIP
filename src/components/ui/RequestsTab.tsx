"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequestItem } from "./RequestItem";
import type { WithdrawalRequestItem } from "@/src/types/withdrawal";
import { reviewRequest } from "@/src/api/endpoints/withdrawal";
import { ReviewPickupModal, openReviewPickupModal } from "@/src/components/ui/Reviewpickupmodal";

type Props = {
    requestsItemArr: WithdrawalRequestItem[];
    itemStatus: string;
};

type ActionState = { status: "idle" | "success" | "error"; message?: string };

export function RequestsTab({ requestsItemArr, itemStatus }: Props) {
    const router = useRouter();
    const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequestItem | null>(null);
    const [localRequests, setLocalRequests] = useState<WithdrawalRequestItem[]>(requestsItemArr);

    useEffect(() => {
        setLocalRequests(requestsItemArr);
    }, [requestsItemArr]);

    const handleApprove = (req: WithdrawalRequestItem) => {
        setSelectedRequest(req);
        openReviewPickupModal("approve", "default");
    };

    const handleReject = (req: WithdrawalRequestItem) => {
        setSelectedRequest(req);
        openReviewPickupModal("reject", "default");
    };

    const approveAction = async (prev: ActionState, formData: FormData): Promise<ActionState> => {
        const itemId = formData.get("itemId") as string;
        
        try {
            await reviewRequest(itemId, "APPROVED");
            
            router.refresh();
            setTimeout(() => setSelectedRequest(null), 1000);
            
            return { status: "success" };
        } catch (error) {
            return {
                status: "error",
                message: "Erro ao aprovar pedido. Tente novamente.",
            };
        }
    };

    const rejectAction = async (prev: ActionState, formData: FormData): Promise<ActionState> => {
        const itemId = formData.get("itemId") as string;

        try {
            await reviewRequest(itemId, "REFUSED");
            
            router.refresh();
            setTimeout(() => setSelectedRequest(null), 1000);
            
            return { status: "success" };
        } catch (error) {
            return {
                status: "error",
                message: "Erro ao rejeitar pedido. Tente novamente.",
            };
        }
    };

    return (
        <div className="w-full rounded-lg pt-3 md:w-[90%] md:pt-0">
            <hr className="border-t border-gray-300 dark:border-gray-700 md:hidden" />

            <h2 className="mb-4 hidden text-lg font-semibold md:block">
                Solicitações
            </h2>

            <div className="mt-4 space-y-2">
                {localRequests.length > 0 ? (
                    localRequests.map((req) => (
                        <RequestItem
                            key={req.id}
                            requestItem={req}
                            itemStatus={itemStatus}
                            onApprove={() => handleApprove(req)}
                            onReject={() => handleReject(req)}
                        />
                    ))
                ) : (
                    <div className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Nenhuma solicitação pendente
                    </div>
                )}
            </div>

            {selectedRequest && (
                <ReviewPickupModal
                    action={approveAction}
                    mode="approve"
                    channel="default"
                    requestData={{
                        userName: selectedRequest.user?.name || "Usuário desconhecido",
                        userAvatar: selectedRequest.user?.avatar,
                        date: selectedRequest.date,
                        description: selectedRequest.description,
                    }}
                    itemId={selectedRequest.id}
                />
            )}

            {selectedRequest && (
                <ReviewPickupModal
                    action={rejectAction}
                    mode="reject"
                    channel="default"
                    requestData={{
                        userName: selectedRequest.user?.name || "Usuário desconhecido",
                        userAvatar: selectedRequest.user?.avatar,
                        description: selectedRequest.description,
                        date: selectedRequest.date
                    }}
                    itemId={selectedRequest.id}
                />
            )}
        </div>
    );
}