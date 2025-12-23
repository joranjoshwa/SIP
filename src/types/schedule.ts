export type DayOfWeek =
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";

export type TimeString = `${number}${number}:${number}${number}:${number}${number}`;

export interface AvailableTime {
    startTime: TimeString;
    endTime: TimeString;
}

export interface AvailableDayTime {
    id?: string;
    availableDay: DayOfWeek;
    availableTimeList: AvailableTime[];
}

export type AvailableScheduleResponse = AvailableDayTime[];

export interface AgendaEditRequestDto {
  availableDayTimeSlotRequest: {
    availableDay: DayOfWeek;
    availableTimeSlotRequest: AvailableTime[];
  }[];
}

export type PtWeekday = "SEG" | "TER" | "QUA" | "QUI" | "SEX" | "SAB" | "DOM";