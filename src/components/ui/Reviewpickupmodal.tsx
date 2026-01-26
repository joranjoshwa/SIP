"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { Button } from "./Button";
import Image from "next/image";

type ActionState = { status: "idle" | "success" | "error"; message?: string };

type Props = {
    action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
    mode: "reject" | "approve";
    channel?: string;
    requestData: {
        userName: string;
        userAvatar?: string;
        description: string;
        date: string;
    };
    itemId: string;
    className?: string;
};

const initialState: ActionState = { status: "idle" };

const evt = (channel: string, mode: string) => `review-pickup:open:${channel}:${mode}`;

export function ReviewPickupModal({
    action,
    mode,
    channel = "default",
    requestData,
    itemId,
    className = "",
}: Props) {
    const [state, formAction] = useActionState(action, initialState);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isReject = mode === "reject";
    const title = isReject ? "Rejeitar reivindicação" : "Aprovar reivindicação";
    const confirmText = isReject ? "Rejeitar pedido" : "Aprovar pedido";
    const confirmMessage = isReject
        ? "Tem certeza que deseja reprovar esse pedido de reivindicação?"
        : "Tem certeza que deseja aprovar esse pedido de reivindicação?";

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener(evt(channel, mode), handler as EventListener);
        return () => window.removeEventListener(evt(channel, mode), handler as EventListener);
    }, [channel, mode]);

    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    useEffect(() => {
        const d = dialogRef.current;
        const content = contentRef.current;
        if (!d || !content) return;
        const handleBackdrop = (e: MouseEvent) => {
            const r = content.getBoundingClientRect();
            const isBackdrop =
                e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
            if (isBackdrop) setOpen(false);
        };
        d.addEventListener("click", handleBackdrop);
        return () => d.removeEventListener("click", handleBackdrop);
    }, []);

    useEffect(() => {
        if (state.status === "success") {
            const t = setTimeout(() => setOpen(false), 900);
            return () => clearTimeout(t);
        }
    }, [state.status]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <dialog
                ref={dialogRef}
                className={`review-dialog
                    fixed bottom-0 left-0 right-0 top-0 m-0 p-0 bg-black/90 border-0 outline-none
                    ${className}
                `}
            >
                <div className="fixed inset-0 bg-black/70 -z-10" aria-hidden="true" />
                <div
                    ref={contentRef}
                    className="
                        mx-auto w-full sm:w-[92vw] sm:max-w-sm
                        rounded-t-3xl sm:rounded-2xl
                        bg-white text-zinc-900 dark:bg-neutral-900 dark:text-neutral-100
                        shadow-2xl
                        fixed left-1/2 -translate-x-1/2
                        bottom-0 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2
                        pb-[env(safe-area-inset-bottom)]
                        transition-opacity duration-200
                    "
                >
                    <div className="md:hidden px-6 pt-3">
                        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                    <div className="px-5 py-4">
                        <h2 className="text-center text-base font-semibold mb-3">{title}</h2>

                        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            {confirmMessage}
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                            {requestData.userAvatar ? (
                                <Image
                                    src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + requestData.userAvatar}
                                    alt={requestData.userName}
                                    width={36}
                                    height={36}
                                    className="w-10 h-10 rounded-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                                        {requestData.userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-sm font-medium">{requestData.userName}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {requestData.date}
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                Justificativa
                            </label>
                            <p
                                className="w-full h-[8em] rounded-lg px-3 py-2.5 text-sm
                                        bg-zinc-50 text-zinc-700 border border-zinc-200
                                        focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent
                                        dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700
                                        dark:focus:ring-rose-700 resize-none"
                            >
                                {requestData.description}
                            </p>
                        </div>

                        <form
                            action={async (fd) => {
                                setSubmitting(true);
                                try {
                                    fd.append("itemId", itemId);
                                    fd.append("mode", mode);
                                    await formAction(fd);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            className="space-y-2"
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                                className={`${isReject ? "bg-[#FFD1D1] dark:bg-[#6D0000]" : ""}`}
                            >
                                {isReject ? "Rejeitar Pedido" : "Aprovar pedido"}
                            </Button>
                        </form>


                        {state.status === "success" && (
                            <div
                                className="mt-4 rounded-lg border px-3 py-2.5 text-sm
                                    border-green-200 bg-green-100/70 text-zinc-900
                                    dark:border-green-800 dark:bg-green-900/40 dark:text-green-100"
                            >
                                <strong>
                                    {isReject
                                        ? "Pedido rejeitado com sucesso!"
                                        : "Pedido aprovado com sucesso!"}
                                </strong>
                            </div>
                        )}
                        {state.status === "error" && (
                            <div
                                className="mt-4 rounded-lg border px-3 py-2.5 text-sm
                                    border-rose-200 bg-rose-100/80 text-zinc-900
                                    dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-100"
                            >
                                <strong>{state.message ?? "Erro ao processar pedido. Tente novamente."}</strong>
                            </div>
                        )}
                    </div>
                </div>
            </dialog>
        </>
    );
}

export function openReviewPickupModal(mode: "reject" | "approve", channel: string = "default") {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(`review-pickup:open:${channel}:${mode}`));
    }
}