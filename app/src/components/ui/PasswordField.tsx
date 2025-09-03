import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { InputField } from "./InputField";

type Props = {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
};

export const PasswordField = ({
    label = "Senha",
    placeholder = "************",
    value,
    onChange,
    className,
    required = true
}: Props) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputField
            label={label}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            icon={<Lock size={18} />}
            className={className}
            required={required}
        >

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

        </InputField>
    );
}