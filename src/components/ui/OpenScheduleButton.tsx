"use client";

import { Button } from "@/src/components/ui/Button";
import { openSchedulePickupModal } from "@/src/components/ui/ScheduleModalProps";

export function OpenScheduleButton({
    channel = "item-claim",
    className = "",
    hidden = false,
    children = "Reivindicar item",
}: {
    channel?: string;
    className?: string;
    hidden?: boolean;
    children?: React.ReactNode;
}) {
    if (hidden) return null;

    return (
        <Button
            type="button"
            variant="secondary"
            className={className}
            onClick={() => openSchedulePickupModal(channel)}
        >
            {children}
        </Button>
    );
}
