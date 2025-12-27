"use client";

import { PageHeader } from "@/src/components/ui/PageHeader";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { MaskedField } from "@/src/components/ui/MaskedField";
import { Button } from "@/src/components/ui/Button";
import { AvailableScheduleResponse, AvailableTime, DayOfWeek, PtWeekday } from "@/src/types/schedule";
import { getSchedule, patchSchedule, deleteWeekDay } from "@/src/api/endpoints/schedule";
import { ScheduleAvailableDay } from "@/src/components/ui/ScheduleAvailableDay";
import { TimeString } from "@/src/types/schedule";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { DAY_ORDER, PT_TO_DAY } from "@/src/enums/WeekDay";

const sortSchedule = (arr: AvailableScheduleResponse): AvailableScheduleResponse =>
    [...arr].sort(
        (a, b) => (DAY_ORDER[a.availableDay] ?? 999) - (DAY_ORDER[b.availableDay] ?? 999)
    );

export default function EditSchedule() {
    const [isOpen, setIsOpen] = useState(false);
    const [weekDay, setWeekDay] = useState<PtWeekday | "">("");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");
    const [schedule, setSchedule] = useState<AvailableScheduleResponse>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const res = await getSchedule();
                setSchedule(res);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, []);

    const onDeleteDay = async (id: string) => {
        let updated: AvailableScheduleResponse = schedule.filter((sc) => sc.id !== id);
        const weekDay: DayOfWeek | undefined = schedule.find((sc) => sc.id === id)?.availableDay;

        setSchedule(updated);
        try {
            if (!weekDay) return;
            await deleteWeekDay(weekDay);
        } catch (e) {
            setSchedule((prev) => prev);
            throw e;
        }
    };

    const onDeleteTime = async (id: string, idx: number) => {
        const day = schedule.find((d) => d?.id === id);

        const removedDay = (day?.availableTimeList?.length ?? 0) <= 1;

        if (removedDay) {
            await onDeleteDay(id);
            return;
        }

        const updated: AvailableScheduleResponse = schedule
            .map((sc) => {
                if (sc.id !== id) return sc;

                const nextList = sc.availableTimeList.filter((_, index) => index !== idx);

                if (nextList.length === 0) return null;

                return {
                    ...sc,
                    availableTimeList: nextList,
                };
            })
            .filter(Boolean) as AvailableScheduleResponse;

        setSchedule(updated);
        await patchSchedule(updated);
    };

    const toHHmmss = (t: string): TimeString => {
        if (t.length === 5) return `${t}:00` as TimeString;
        if (t.length >= 8) return t.slice(0, 8) as TimeString;
        return "00:00:00" as TimeString;
    };

    const onSubmit = async (): Promise<void> => {
        const day = PT_TO_DAY[weekDay as PtWeekday];

        if (!day) {
            throw new Error("Selecione um dia da semana.");
        }

        if (!timeStart || !timeEnd) {
            throw new Error("Informe o horário de início e fim.");
        }

        const newSlot: AvailableTime = {
            startTime: toHHmmss(timeStart),
            endTime: toHHmmss(timeEnd),
        };

        const dayObj = schedule.find((d) => d.availableDay === day);

        const alreadyExists = dayObj?.availableTimeList?.some(
            (s) => s.startTime === newSlot.startTime && s.endTime === newSlot.endTime
        );

        if (alreadyExists) {
            throw new Error("Esse horário já está cadastrado para esse dia.");
        }

        const updated: AvailableScheduleResponse = (() => {
            const idx = schedule.findIndex((d) => d.availableDay === day);

            if (idx === -1) {
                return sortSchedule([
                    ...schedule,
                    {
                        availableDay: day,
                        availableTimeList: [newSlot],
                    },
                ]);
            }

            return schedule.map((d, i) => {
                if (i !== idx) return d;

                const nextList: AvailableTime[] = [
                    ...d.availableTimeList,
                    newSlot,
                ].filter(
                    (s, j, arr) =>
                        j === arr.findIndex(
                            (x) => x.startTime === s.startTime && x.endTime === s.endTime
                        )
                );

                return { ...d, availableTimeList: nextList };
            });
        })();

        await patchSchedule(updated);
    };

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const res = await getSchedule();
                setSchedule(res);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [refreshKey]);

    const handleSave = async () => {
        setError(null);

        try {
            setIsSaving(true);
            await onSubmit();
            setIsOpen(false);
            setRefreshKey((prev) => prev + 1);
        } catch (err: any) {
            setError(err?.message ?? "Erro ao salvar horário.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="px-5 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
                <PageHeader title="Disponibilidade" />

                <button type="button" onClick={() => setIsOpen(true)}>
                    <Plus className="w-7 h-7" />
                </button>
            </div>

            <ScrollableArea>
                <div className="flex flex-wrap gap-3">
                    {schedule.map((day) => (
                        <ScheduleAvailableDay
                            key={day.id ?? day.availableDay}
                            {...day}
                            availableTimeList={day.availableTimeList ?? []}
                            onDeleteTime={onDeleteTime}
                            onDeleteDay={onDeleteDay}
                        />
                    ))}
                </div>
            </ScrollableArea>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 md:flex md:items-center md:justify-center"
                    onMouseDown={() => setIsOpen(false)}
                >
                    <div
                        className="
                            fixed bottom-0 left-0 right-0
                            w-full px-5 pb-4 rounded-t-[30px]
                            min-w-[400px] 
                            bg-white text-zinc-900
                            dark:bg-neutral-900 dark:text-neutral-100

                            md:static md:w-[22%] md:rounded-[30px]
                        "
                        onMouseDown={(e) => e.stopPropagation()}
                    >

                        <div className="md:hidden px-6 pt-3">
                            <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                        </div>

                        <div className="px-6 md:pt-4">
                            <h2 className="text-center text-xl font-semibold">Horário disponível</h2>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <MaskedField
                                mode="time"
                                value={timeStart}
                                onChange={setTimeStart}
                                ghostText="Início"
                            />

                            <MaskedField
                                mode="time"
                                value={timeEnd}
                                onChange={setTimeEnd}
                                ghostText="Fim"
                            />
                        </div>

                        <div className="pb-5 pt-2">
                            <div
                                className="
                                    flex flex-nowrap gap-3
                                    justify-between
                                    overflow-x-auto whitespace-nowrap
                                    scroll-smooth snap-x snap-mandatory
                                "
                            >
                                {["SEG", "TER", "QUA", "QUI", "SEX", "SAB"].map((d) => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setWeekDay((prev) => (prev === d ? "" : d) as PtWeekday)}
                                        className={`
                                            h-12 w-12 shrink-0 snap-center
                                            rounded-full border border-gray-600 font-bold
                                            flex items-center justify-center
                                            text-black dark:text-white
                                            ${d === weekDay
                                                ? "bg-[#D4EED9] !border-[#D4EED9] dark:bg-[#183E1F] dark:!border-[#183E1F]"
                                                : ""}
                                        `}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div
                                className="
                                    my-2 rounded-xl bg-[#F9D0D0] px-4 py-3
                                    text-sm
                                    dark:bg-[#570000]
                                "
                            >
                                {error}
                            </div>
                        )}

                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>

                        <Button
                            variant="primary"
                            className="my-2"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Salvando..." : "Salvar horário como disponível"}
                        </Button>
                    </div>
                </div >
            )
            }
        </div >
    );
};

