import Image from "next/image";
import logo from "../../assets/logo-sip.svg"
import logoBranca from "../../assets/logo-sip-branco.svg"
import { useTheme } from "../../context/ThemeContext";

type Props = {
    className?: string;
}

export const Logo = ({ className }: Props) => {
    const { theme } = useTheme();

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image 
                src={theme === "dark" ? logoBranca : logo}
                alt="Logo SIP"
                width={60}
                height={90}
                priority
            />
        </div>
    );
}