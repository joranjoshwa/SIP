import { forwardRef, useImperativeHandle, useState } from "react";
import { InputField } from "./InputField";

export type NumberInputFieldRef = {
    reset: () => void;
};

type Props = {
    label?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number | null) => void;
};

export const NumberInputField = forwardRef<NumberInputFieldRef, Props>(
    (
        {
            label = "Número",
            placeholder = "Digite um número",
            min,
            max,
            step,
            onChange,
        },
        ref
    ) => {
        const [value, setValue] = useState<string>("");

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setValue(val);
            onChange(val ? parseInt(val, 10) : null);
        };

        useImperativeHandle(ref, () => ({
            reset: () => {
                setValue("");
                onChange(null);
            },
        }));

        return (
            <>
                <label className="text-sm">{label}</label>
                <InputField
                    type="number"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="mt-1"
                    required={false}
                >
                </InputField>
            </>
        );
    }
);

NumberInputField.displayName = "NumberInputField";
