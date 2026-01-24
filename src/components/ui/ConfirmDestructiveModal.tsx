"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./Button";

type Preview = {
    imageUrl?: string | null;
    fallbackText?: string;
    primary: string;
    secondary?: string;
    meta?: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    message: string;

    preview?: Preview;

    cancelLabel?: string;
    confirmLabel: string;

    onConfirm: () => Promise<void>;

    isItem?: boolean;
};

export function ConfirmDestructiveModal({
    open,
    onOpenChange,
    title,
    message,
    preview,
    cancelLabel = "Cancelar",
    confirmLabel,
    onConfirm,
    isItem = false
}: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.message ||
                "Não foi possível concluir a operação. Tente novamente.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    const isBlob = (url?: string | null) => !!url?.startsWith("blob:");

    return (
        <div className="fixed inset-0 z-[100]">

            <button
                aria-label="Fechar"
                onClick={() => !loading && onOpenChange(false)}
                className="absolute inset-0 bg-black/40"
            />

            <div className="absolute md:left-1/2 md:top-1/2 md:w-[92vw] md:max-w-sm md:-translate-x-1/2 md:-translate-y-1/2
                            bottom-0 w-full">
                <div className="md:rounded-2xl rounded-t-2xl rounded-b-none bg-white md:p-5 p-5 pb-6 shadow-xl dark:bg-neutral-900">
                    
                    <div className="md:hidden px-6 pb-3">
                        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    </div>

                    <h2 className="text-center text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {title}
                    </h2>

                    <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-300">
                        {message}
                    </p>

                    {preview && (
                        <div className="mt-4 flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-white/5">
                            <div className={`relative h-10 w-10 overflow-hidden ${isItem ? "rounded-l" : "rounded-full" } bg-zinc-200 dark:bg-zinc-700`}>
                                {preview.imageUrl ? (
                                    isBlob(preview.imageUrl) ? (
                                        <img
                                            src={preview.imageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + preview.imageUrl}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                            unoptimized
                                        />
                                    )
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                                        {preview.fallbackText ?? "?"}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                    {preview.primary}
                                </p>
                                {preview.secondary && (
                                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                                        {preview.secondary}
                                    </p>
                                )}
                                {preview.meta && (
                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                        {preview.meta}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div
                            className={[
                                "mt-4 rounded-xl border px-4 py-3 text-sm",
                                "border-red-200 bg-red-50 text-red-700",
                                "dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200",
                            ].join(" ")}
                        >
                            {error}
                        </div>
                    )}

                    <div className="mt-5 space-y-2">
                        <Button
                            variant="tertiary"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className={[
                                "w-full rounded-xl px-4 py-2 text-sm font-medium transition",
                                "text-zinc-700",
                                "dark:text-zinc-200",
                                loading ? "opacity-60 cursor-not-allowed" : "",
                            ].join(" ")}
                        >
                            {cancelLabel}
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={loading}
                            className={[
                                "w-full rounded-xl px-4 py-2 text-sm transition",
                                "bg-[#F9D0D0]",
                                "dark:bg-[#570000]",
                                loading ? "opacity-60 cursor-not-allowed" : "",
                            ].join(" ")}
                        >
                            {loading ? "Deletando..." : confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
