import logo from "../../assets/sip-icon.svg"
import loading from "../../assets/loading.gif"
import Image from "next/image";

type Props = {
    isLoading: boolean;
    className?: string;
}

export const Loading = ({ isLoading, className }: Props) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#d4d4db] bg-opacity-70 z-50">
            <div className={`relative w-24 h-24 bg-[#d4d4db] ${className}`}>
                <Image
                    src={loading}
                    alt="Carregando..."
                    unoptimized
                    priority
                    className="w-50 h-50"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <Image src={logo} alt="Logo SIP" width={40} height={40} priority />
                </div>  
            </div>

        </div>
    );
}