import Image from "next/image";
import logoInverted from "../../assets/logo-sip-dark.svg";
import logo from "../../assets/logo-sip.svg"
import logoBranca from "../../assets/logo-sip-branco.svg"
import { useTheme } from "@/src/context/ThemeContext";

type Props = {
    className?: string;
    mode?: string;
    imageClassName?: string;
}

export const Logo = ({ className, mode = "light", imageClassName="" }: Props) => {

    const { theme } = useTheme();
    const logoSrc = theme === "dark" ? logoBranca : logo;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image
                src={logoSrc}
                alt="Logo SIP"
                width={60}
                height={90}
                className={imageClassName}
                priority
            />
        </div>
    );
}
