import Image from "next/image";
import logo from "../../assets/logo-sip.svg"

type Props = {
    className?: string;
}

export const Logo = ({ className }: Props) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image 
                src={logo}
                alt="Logo SIP"
                width={60}
                height={90}
                priority
            />
        </div>
    );
}