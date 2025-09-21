import { InputField } from "./InputField";
import { CalendarDays } from "lucide-react";

export const DateRangeSelector = () => {
    return (
        <div className="mt-1">
            <div className="flex space-x-4">
                <div className="flex-1">
                    <label className="text-sm text-gray-700 dark:text-white">A partir de</label>
                    <InputField
                        type="date"
                        placeholder="Data de início"
                        icon={<CalendarDays className="w-[16px] h-[16px]" />}
                        className="mt-1 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="text-sm text-gray-700 dark:text-white">Até</label>
                    <InputField
                        type="date"
                        placeholder="Data final"
                        icon={<CalendarDays className="w-[16px] h-[16px]" />}
                        className="mt-1 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
        </div>
    );
};
