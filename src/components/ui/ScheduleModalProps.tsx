"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";

import { MaskedField } from "./MaskedField";

type ActionState = { status: "idle" | "success" | "error"; message?: string };

type Props = {
    action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
    confirmLabel?: string;
    channel?: string;
    itemId: string;
    userEmail: string;
    className?: string;
    token: string;
};

const initialState: ActionState = { status: "idle" };

const evt = (channel: string) => `schedule-pickup:open:${channel}`;

export function SchedulePickupModal({
    action,
    confirmLabel = "Confirmar solicitação",
    channel = "default",
    className = "",
    itemId,
    userEmail,
    token,
}: Props) {
    const [state, formAction] = useActionState(action, initialState);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [dateStr, setDateStr] = useState("");
    const [timeStr, setTimeStr] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const handler = () => setOpen(true);
        window.addEventListener(evt(channel), handler as EventListener);
        return () => window.removeEventListener(evt(channel), handler as EventListener);
    }, [channel]);

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

    return (
        <>
            <dialog
                ref={dialogRef}
                className={`schedule-dialog
                    fixed bottom-0 left-0 right-0 top-0 m-0 p-0 bg-transparent border-0 outline-none
                    ${className}
                `}
            >
                <div
                    ref={contentRef}
                    className="
                        mx-auto w-full sm:w-[92vw] sm:max-w-md
                        rounded-t-3xl sm:rounded-3xl
                        bg-white text-zinc-900 dark:bg-neutral-900 dark:text-neutral-100
                        border-t border-zinc-200 dark:border-zinc-800 sm:border
                        shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.35)]
                        pb-[env(safe-area-inset-bottom)]
                        fixed left-1/2 -translate-x-1/2
                        bottom-0 sm:top-1/2 sm:-translate-y-1/2 sm:bottom-auto
                        transition-opacity duration-200
                    "
                >
                    <div className="px-6 pt-3">
                        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    </div>

                    <div className="px-6">
                        <h2 className="text-center text-xl font-semibold">Agendar busca</h2>
                    </div>

                    <form
                        action={async (fd) => {
                            setSubmitting(true);
                            try {
                                fd.append("itemId", itemId);
                                fd.append("userEmail", userEmail);
                                fd.append("token", token);
                                await formAction(fd);
                            } finally {
                                setSubmitting(false);
                            }
                        }}
                        className="px-6 pb-6"
                    >
                        <input type="hidden" name="date" value={dateStr} />
                        <input type="hidden" name="time" value={timeStr} />
                        <input type="hidden" name="itemId" value={itemId} />
                        <input type="hidden" name="userEmail" value={userEmail} />
                        <input type="hidden" name="token" value={token} />

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <MaskedField
                                mode="date"
                                label="Data"
                                value={dateStr}
                                onChange={(v) => {
                                    setSubmitting(false);
                                    setDateStr(v);
                                }}
                                onValidChange={() => { }}
                                ghostText="Data da busca"
                            />

                            <MaskedField
                                mode="time"
                                label="Hora"
                                value={timeStr}
                                onChange={(v) => {
                                    setSubmitting(false);
                                    setTimeStr(v);
                                }}
                                onValidChange={() => { }}
                                ghostText="Horário"
                                showRightChevron
                            />
                        </div>

                        <p className="mt-4 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
                            Esteja na sala da <strong>CAENS</strong> com pelo menos 5 minutos de antecedência e
                            aguarde até ser possível conversar com a responsável.
                        </p>

                        <button
                            type="submit"
                            disabled={!dateStr || !timeStr || submitting}
                            className="
                                mt-5 h-12 w-full rounded-xl
                                bg-[#D4EED9] text-black hover:bg-emerald-200/90 disabled:opacity-50
                                dark:bg-[#183E1F] dark:text-white dark:hover:bg-[#183e1f]
                            "
                        >
                            {confirmLabel}
                        </button>

                        {state.status === "success" && (
                            <div
                                className="
                                    mt-6 rounded-xl border px-4 py-3 text-sm
                                    border-green-200 bg-green-100/70 text-zinc-900
                                    dark:border-green-800 dark:bg-green-900/40 dark:text-green-100
                                "
                            >
                                <strong>Sua solicitação de reivindicação foi enviada com sucesso!</strong>
                            </div>
                        )}
                        {state.status === "error" && (
                            <div
                                className="
                                    mt-6 rounded-xl border px-4 py-3 text-sm
                                    border-rose-200 bg-rose-100/80 text-zinc-900
                                    dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-100
                                "
                            >
                                <strong>
                                    {state.message ??
                                        "Não há nenhum servidor disponível na data e horário selecionados! Tente novamente."}
                                </strong>{" "}
                            </div>
                        )}

                    </form>
                </div>
            </dialog>
        </>
    );
}

export function openSchedulePickupModal(channel: string = "default") {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(`schedule-pickup:open:${channel}`));
    }
}
