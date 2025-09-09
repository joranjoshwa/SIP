import logo from "../../assets/sip-icon.svg"
import loading from "../../assets/loading.gif"
import loadingWhite from "../../assets/loading-white.gif"
import Image from "next/image";
import { useTheme } from "../../context/ThemeContext";

type Props = {
    isLoading: boolean;
    className?: string;
}

export const Loading = ({ isLoading, className }: Props) => {
    const { theme } = useTheme();
    
    if (!isLoading) return null;

    const gifSrc = theme === "dark" ? loadingWhite : loading;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className={`relative h-39 ${className}`}>
                <Image
                    src={gifSrc}
                    alt="Carregando..."
                    unoptimized
                    priority
                    className="w-full h-full"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <Image src={logo} alt="Logo SIP" width={90} height={90} priority />
                </div>  
            </div>

        </div>
    );
}