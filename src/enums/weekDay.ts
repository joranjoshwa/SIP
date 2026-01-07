import { DayOfWeek, PtWeekday } from "../types/schedule";

export const PT_TO_DAY: Record<PtWeekday, DayOfWeek> = {
    SEG: "MONDAY",
    TER: "TUESDAY",
    QUA: "WEDNESDAY",
    QUI: "THURSDAY",
    SEX: "FRIDAY",
    SAB: "SATURDAY",
    DOM: "SUNDAY",
};

export const DAY_ORDER: Record<DayOfWeek, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
};