"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { getSchedule } from "@/src/api/endpoints/schedule";
import { MaskedField } from "./MaskedField";
import { AvailableScheduleResponse, AvailableTime, DayOfWeek } from "@/src/types/schedule";
import { useLayoutEffect } from "react";

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

const DAY_MAP: Record<number, DayOfWeek> = {
    0: "SUNDAY",
    1: "MONDAY",
    2: "TUESDAY",
    3: "WEDNESDAY",
    4: "THURSDAY",
    5: "FRIDAY",
    6: "SATURDAY",
};

export const getWeekdayFromBRDate = (dateStr: string): DayOfWeek => {
    const [dd, mm, yyyy] = dateStr.split("/").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return DAY_MAP[date.getDay()];
};

const pad2 = (n: number) => String(n).padStart(2, "0");

const formatBR = (dt: Date) =>
    `${pad2(dt.getDate())}/${pad2(dt.getMonth() + 1)}/${dt.getFullYear()}`;

const WEEKDAY_PT: Record<number, string> = {
    0: "DOM",
    1: "SEG",
    2: "TER",
    3: "QUA",
    4: "QUI",
    5: "SEX",
    6: "SAB",
};

const isWeekday = (dt: Date) => {
    const d = dt.getDay();
    return d !== 0 && d !== 6;
};

const nextWeekdays = (count: number, from: Date) => {
    const res: Date[] = [];
    const cur = new Date(from.getFullYear(), from.getMonth(), from.getDate()); // midnight local
    while (res.length < count) {
        if (isWeekday(cur)) res.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return res;
};

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
    const [schedule, setSchedule] = useState<AvailableScheduleResponse>([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<AvailableTime[]>([]);
    const [activeField, setActiveField] = useState<"date" | "time" | null>(null);
    const quickPanelRef = useRef<HTMLDivElement>(null);
    const [showQuickPanel, setShowQuickPanel] = useState(false);
    const [quickPhase, setQuickPhase] = useState<"enter" | "exit">("exit");
    const dateFieldWrapRef = useRef<HTMLDivElement>(null);
    const panelAnimRef = useRef<Animation | null>(null);
    const [quickAnim, setQuickAnim] = useState<{ fromX: number; fromY: number; ready: boolean }>({
        fromX: 0,
        fromY: 0,
        ready: false,
    });
    const animTokenRef = useRef(0);
    const showDatePanel = activeField === "date" || dateStr.length === 10;
    const quickDayOptions = (() => {
        const allowed = new Set(schedule.map((d) => d.availableDay));
        const days = nextWeekdays(7, new Date());

        return days
            .map((dt) => {
                const dayOfWeek = DAY_MAP[dt.getDay()];
                if (!allowed.has(dayOfWeek)) return null;

                return {
                    key: dt.toISOString().slice(0, 10),
                    date: dt,
                    label: `${WEEKDAY_PT[dt.getDay()]}`,
                    value: formatBR(dt),
                };
            })
            .filter(Boolean) as { key: string; date: Date; label: string; value: string }[];
    })();

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
            const target = e.target as Node;

            if (content.contains(target)) return;

            if (quickPanelRef.current?.contains(target)) return;

            setOpen(false);
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

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const data = await getSchedule();
                if (mounted) setSchedule(data);
            } catch (e) {
                console.error(e);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!dateStr || dateStr.length !== 10) {
            setAvailableTimeSlots([]);
            setTimeStr("");
            return;
        }

        const day = getWeekdayFromBRDate(dateStr);

        const daySchedule = schedule.find((d) => d.availableDay === day);

        setAvailableTimeSlots(daySchedule?.availableTimeList ?? []);
    }, [dateStr, schedule]);

    useLayoutEffect(() => {
        const shouldBeOpen = quickDayOptions.length > 0 && showDatePanel;

        if (shouldBeOpen) {
            setShowQuickPanel(true);
            setQuickPhase("enter");
            return;
        }

        if (showQuickPanel) {
            setQuickPhase("exit");
        }
    }, [showDatePanel, quickDayOptions.length, showQuickPanel]);


    useLayoutEffect(() => {
        const content = contentRef.current;
        const field = dateFieldWrapRef.current;
        const panel = quickPanelRef.current;

        if (!content || !field || !panel) return;
        panelAnimRef.current?.cancel();
        const token = ++animTokenRef.current;

        const contentRect = content.getBoundingClientRect();
        const fieldRect = field.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();

        const originX = fieldRect.left - contentRect.left + 12;
        const originY = fieldRect.top - contentRect.top + fieldRect.height / 2;

        const finalX = panelRect.left - contentRect.left;
        const finalY = panelRect.top - contentRect.top;

        const fromX = originX - finalX;
        const fromY = originY - finalY;

        panel.style.willChange = "transform, opacity";
        panel.style.transformOrigin = "left center";

        if (quickPhase === "enter") {
            panelAnimRef.current = panel.animate(
                [
                    { transform: `translate(${fromX}px, ${fromY}px) scale(0.98)`, opacity: 0 },
                    { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
                ],
                { duration: 220, easing: "ease", fill: "both" }
            );
        }

        if (quickPhase === "exit") {
            const anim = panel.animate(
                [
                    { transform: "translate(0px, 0px) scale(1)", opacity: 1 },
                    { transform: `translate(${fromX}px, ${fromY}px) scale(0.98)`, opacity: 0 },
                ],
                { duration: 180, easing: "ease", fill: "both" }
            );

            panelAnimRef.current = anim;

            anim.onfinish = () => {
                if (animTokenRef.current !== token) return;
                setShowQuickPanel(false);
            };
        }
    }, [showQuickPanel, quickPhase]);


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
                    <div className="md:hidden px-6 pt-3">
                        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    </div>

                    <div className="px-6 pt-3">
                        <h2 className="text-center text-xl font-semibold">Agendar busca</h2>
                    </div>

                    {showQuickPanel && (
                        <div
                            ref={quickPanelRef}
                            className="m-4 absolute z-50 top-[-80px] md:top-0 md:left-[-100px]"
                            style={{
                                willChange: "transform, opacity",
                                transition: "transform 220ms ease, opacity 220ms ease",
                                transform: quickAnim.ready
                                    ? "translate(0px, 0px) scale(1)"
                                    : `translate(${quickAnim.fromX}px, ${quickAnim.fromY}px) scale(0.98)`,
                                opacity: quickAnim.ready ? 1 : 0,
                                transformOrigin: "left center",
                                pointerEvents: quickAnim.ready ? "auto" : "none",
                            }}
                            onTransitionEnd={(e) => {
                                if (quickPhase === "exit" && e.propertyName === "transform") {
                                    setShowQuickPanel(false);
                                }
                            }}
                        >
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                                {quickDayOptions.map((opt) => {
                                    const selected = dateStr === opt.value;

                                    return (
                                        <button
                                            key={opt.key}
                                            type="button"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={() => {
                                                setSubmitting(false);
                                                setDateStr(opt.value);
                                                setActiveField("date");
                                            }}
                                            className={[
                                                "shrink-0 h-12 w-12 rounded-full border text-md font-bold transition-colors pt-[2px]",
                                                selected
                                                    ? "bg-[#D4EED9] text-zinc-900 dark:bg-[#183E1F] dark:text-white border-none"
                                                    : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700",
                                            ].join(" ")}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}


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
                            <div ref={dateFieldWrapRef}>
                                <MaskedField
                                    mode="date"
                                    label="Data"
                                    value={dateStr}
                                    onChange={(v) => {
                                        setSubmitting(false);
                                        setDateStr(v);
                                    }}
                                    onFocusChange={(f) => setActiveField(f ? "date" : null)}
                                    onValidChange={() => { }}
                                    ghostText="Data da busca"
                                />
                            </div>

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

                        {dateStr.length !== 10 ? (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">
                                Digite uma data (DD/MM/AAAA) para carregar os horários disponíveis.
                            </p>
                        ) : (
                            <>
                                <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 mt-4">
                                    Horários disponíveis
                                </p>

                                {availableTimeSlots.length === 0 ? (
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Nenhum horário disponível para este dia.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2 overflow-x-auto scrollbar-hide">
                                        {availableTimeSlots.map((slot) => {
                                            const label =
                                                slot.startTime.slice(0, 5) + " - " + slot.endTime.slice(0, 5);
                                            const startTime = slot.startTime.slice(0, 5);
                                            const selected = timeStr === startTime;

                                            return (
                                                <button
                                                    key={`${slot.startTime}-${slot.endTime}`}
                                                    type="button"
                                                    onClick={() => setTimeStr(startTime)}
                                                    className={[
                                                        "h-8 rounded-xl border text-sm font-medium transition-colors",
                                                        selected
                                                            ? "bg-[#D4EED9] text-zinc-900 dark:bg-[#183E1F] dark:text-white border-none"
                                                            : "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700",
                                                    ].join(" ")}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}

                        <label
                            htmlFor="description"
                            className="mb-1 mt-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                        >
                            Justificativa
                        </label>
                        <textarea id="description" name="description" rows={3}
                            className=" w-full rounded-xl
                                            px-1 py-3
                                            shadow-inner resize-none
                                            focus:outline-none
                                            bg-zinc-100 text-zinc-600 pl-4 text-sm transition-colors
                                            hover:bg-zinc-200
                                            dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">

                        </textarea>

                        <p className="mt-4 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
                            Esteja na sala da <strong>CAENS</strong> com pelo menos 5 minutos de antecedência e
                            aguarde até ser possível conversar com a responsável.
                        </p>

                        <button
                            type="submit"
                            disabled={!dateStr || !timeStr || submitting}
                            className="
                                mt-5 h-12 w-full rounded-xl
                                bg-[#D4EED9] text-black text-sm hover:bg-emerald-200/90 disabled:opacity-50
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
