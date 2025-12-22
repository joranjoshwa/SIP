import { AxiosError } from "axios";
import { api } from "../axios";
import {
    AvailableScheduleResponse,
    AvailableTime,
    DayOfWeek,
    AgendaEditRequestDto
} from "@/src/types/schedule";

const toHHmmss = (t: string) => (t.length === 5 ? `${t}:00` : t.slice(0, 8));

const dedupeSlots = <T extends { startTime: string; endTime: string }>(slots: T[]) =>
    Array.from(new Map(slots.map(s => [`${s.startTime}-${s.endTime}`, s])).values());

export const mapScheduleToAgendaEdit = (schedule: AvailableScheduleResponse) => ({
    availableDayTimeSlotRequest: schedule.map((day) => ({
        availableDay: day.availableDay,
        availableTimeSlotRequest: dedupeSlots(
            day.availableTimeList.map((t) => ({
                startTime: toHHmmss(t.startTime),
                endTime: toHHmmss(t.endTime),
            }))
        ),
    })),
});


const DAY_ORDER: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
};

export const getSchedule = async (): Promise<AvailableScheduleResponse> => {
    try {
        const { data } = await api.get<AvailableScheduleResponse>("/agenda");

        return [...data].sort(
            (a, b) => (DAY_ORDER[a.availableDay] ?? 999) - (DAY_ORDER[b.availableDay] ?? 999)
        );
    } catch (err) {
        const e = err as AxiosError;
        throw new Error(
            (e.response?.data as any)?.message ?? e.message ?? "Failed to load schedule"
        );
    }
};


export const patchSchedule = async (schedule: AvailableScheduleResponse): Promise<void> => {
    try {
        const payload = mapScheduleToAgendaEdit(schedule);
        await api.patch("/agenda/admin", payload, {
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        const e = err as AxiosError<any>;

        const apiMsg =
            e.response?.data?.message ??
            e.response?.data?.error ??
            (typeof e.response?.data === "string" ? e.response.data : null);

        throw new Error(apiMsg ?? e.message ?? "Failed to save schedule");
    }
};
