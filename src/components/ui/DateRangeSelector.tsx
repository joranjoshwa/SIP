import { useState, forwardRef, useImperativeHandle } from "react";
import { InputField } from "./InputField";
import { CalendarDays } from "lucide-react";

export type DateRangeSelectorRef = {
    reset: () => void;
};

type Props = {
    handleDateSelection: (start: Date | null, end: Date | null) => void;
};

export const DateRangeSelector = forwardRef<DateRangeSelectorRef, Props>(
    ({ handleDateSelection }, ref) => {
        const [start, setStart] = useState<string>("");
        const [end, setEnd] = useState<string>("");

        const onChangeStart = (value: string) => {
            setStart(value);
            if (value && end) {
                handleDateSelection(new Date(value), new Date(end));
            }
        };

        const onChangeEnd = (value: string) => {
            setEnd(value);
            if (start && value) {
                handleDateSelection(new Date(start), new Date(value));
            }
        };

        useImperativeHandle(ref, () => ({
            reset() {
                setStart("");
                setEnd("");
                handleDateSelection(null, null);
            },
        }));

        return (
            <div className="mt-1">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="text-sm text-gray-700 dark:text-white">
                            A partir de
                        </label>
                        <InputField
                            type="date"
                            placeholder="Data de início"
                            value={start}
                            onChange={(e) => onChangeStart(e.target.value)}
                            icon={<CalendarDays className="w-[16px] h-[16px]" />}
                            className="mt-1 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm text-gray-700 dark:text-white">
                            Até
                        </label>
                        <InputField
                            type="date"
                            placeholder="Data final"
                            value={end}
                            onChange={(e) => onChangeEnd(e.target.value)}
                            icon={<CalendarDays className="w-[16px] h-[16px]" />}
                            className="mt-1 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        );
    }
);

DateRangeSelector.displayName = "DateRangeSelector";
