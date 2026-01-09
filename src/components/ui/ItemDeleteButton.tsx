"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

import { Button } from "@/src/components/ui/Button";
import { ConfirmDestructiveModal } from "@/src/components/ui/ConfirmDestructiveModal";

type Props = {
    hidden?: boolean;

    itemId: string;
    itemTitle: string;
    foundAt?: string;
    itemSubtitle?: string;
    itemImageUrl?: string | null;

    onDelete: () => Promise<void>;
};

export function ItemDeleteButton({
    hidden,
    itemId,
    itemTitle,
    itemImageUrl,
    foundAt,
    onDelete,
}: Props) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    if (hidden) return null;
    const formatPtBr = (value?: string | number | null) => {
        if (value == null) return null;
        const d = new Date(value);
        return isNaN(d.getTime())
            ? null
            : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className={[
                    "block w-full py-3 min-h-[48px] rounded-xl font-medium text-sm transition-colors",
                    "bg-[#D4EED9] text-black dark:bg-[#183E1F] dark:text-white",
                    "mt-8 text-lg md:w-full",
                ].join(" ")}
            >
                <div className="flex items-center justify-center gap-2 text-[16px]">
                    <Trash className="w-5 h-5" />
                    <span>Deletar item</span>
                </div>
            </Button>

            <ConfirmDestructiveModal
                open={open}
                onOpenChange={setOpen}
                title="Deletar item"
                message="Essa ação é permanente. Tem certeza que deseja deletar este item?"
                confirmLabel="Deletar item"
                preview={{
                    imageUrl: itemImageUrl ?? null,
                    fallbackText: itemTitle?.slice(0, 2)?.toUpperCase() ?? "?",
                    primary: itemTitle,
                    meta: (() => {
                        const date = formatPtBr(foundAt);
                        return date ? `Achado em: ${date}` : undefined;
                    })(),
                }}
                onConfirm={async () => {
                    await onDelete();
                    router.back();
                    router.refresh();
                }}
            />
        </>
    );
}
