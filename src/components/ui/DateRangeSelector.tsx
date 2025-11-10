import { useState, forwardRef, useImperativeHandle } from "react";
import { MaskedField } from "./MaskedField";

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
        const [validStart, setValidStart] = useState<Date | null>(null);
        const [validEnd, setValidEnd] = useState<Date | null>(null);

        const onChangeStart = (value: string) => {
            setStart(value);
        };

        const onValidChangeStart = (date: Date | number | null) => {
            const validDate = date instanceof Date ? date : null;
            setValidStart(validDate);
            if (validDate && validEnd) {
                handleDateSelection(validDate, validEnd);
            } else if (!validDate && !validEnd) {
                handleDateSelection(null, null);
            }
        };

        const onChangeEnd = (value: string) => {
            setEnd(value);
        };

        const onValidChangeEnd = (date: Date | number | null) => {
            const validDate = date instanceof Date ? date : null;
            setValidEnd(validDate);
            if (validStart && validDate) {
                handleDateSelection(validStart, validDate);
            } else if (!validStart && !validDate) {
                handleDateSelection(null, null);
            }
        };

        useImperativeHandle(ref, () => ({
            reset() {
                setStart("");
                setEnd("");
                setValidStart(null);
                setValidEnd(null);
                handleDateSelection(null, null);
            },
        }));

        return (
            <div className="mt-1">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <MaskedField
                            mode="date"
                            label="A partir de"
                            value={start}
                            onChange={onChangeStart}
                            onValidChange={onValidChangeStart}
                            ghostText="Data de início"
                            placeholder="DD/MM/AAAA"
                        />
                    </div>
                    <div className="flex-1">
                        <MaskedField
                            mode="date"
                            label="Até"
                            value={end}
                            onChange={onChangeEnd}
                            onValidChange={onValidChangeEnd}
                            ghostText="Data final"
                            placeholder="DD/MM/AAAA"
                        />
                    </div>
                </div>
            </div>
        );
    }
);

DateRangeSelector.displayName = "DateRangeSelector";