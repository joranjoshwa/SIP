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
    autoComplete?: string;
};

export const PasswordField = ({
    label = "Senha",
    placeholder = "************",
    value,
    onChange,
    className,
    required = true,
    autoComplete = "current-password",
}: Props) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
            autoComplete={autoComplete}
        >

            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-500"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>

        </InputField>
    );
}