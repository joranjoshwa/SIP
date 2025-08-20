import Image from "next/image";

type Props = {
    className?: string;
}

export const Logo = ({ className }: Props) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image 
                src="./assets/logo-sip.svg"
                alt="Logo SIP"
                width={28}
                height={28}
                priority
            />
        </div>
    );
}