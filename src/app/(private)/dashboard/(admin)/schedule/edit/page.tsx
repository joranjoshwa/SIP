"use client";

import { PageHeader } from "@/src/components/ui/PageHeader";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MaskedField } from "@/src/components/ui/MaskedField";
import { Button } from "@/src/components/ui/Button";

export default function EditSchedule() {
    const [isOpen, setIsOpen] = useState(false);
    const [weekDay, setWeekDay] = useState("");
    const [timeStart, setTimeStart] = useState("");
    const [timeEnd, setTimeEnd] = useState("");

    return (
        <div className="px-5">
            <div className="flex items-center justify-between">
                <PageHeader title="Disponibilidade" />

                <button type="button" onClick={() => setIsOpen(true)}>
                    <Plus className="w-7 h-7" />
                </button>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 md:flex md:items-center md:justify-center"
                    onMouseDown={() => setIsOpen(false)}
                >
                    <div
                        className="
                            fixed bottom-0 left-0 right-0
                            w-full px-5 pb-4 rounded-t-[30px]
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
                                        onClick={() => setWeekDay((prev) => (prev === d ? "" : d))}
                                        className={`
                                            h-12 w-12 shrink-0 snap-center
                                            rounded-full border border-gray-600 font-bold
                                            flex items-center justify-center
                                            text-black dark:text-white
                                            ${d === weekDay
                                                ? "bg-[#D4EED9] border-[#D4EED9] dark:bg-[#183E1F] dark:border-[#183E1F]"
                                                : ""}
                                        `}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>

                        <Button
                            variant="primary"
                            className="my-2"
                            onClick={() => {
                                // aqui você salva:
                                // weekDay, timeStart, timeEnd
                                setIsOpen(false);
                            }}
                        >
                            Salvar horário como disponível
                        </Button>
                    </div>
                </div >
            )
            }
        </div >
    );
}
