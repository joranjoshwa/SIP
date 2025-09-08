import Image from "next/image";
import logoInverted from "../../assets/logo-sip-dark.svg";
import logo from "../../assets/logo-sip.svg"

type Props = {
    className?: string;
    mode?: string;
    imageClassName?: string;
}

export const Logo = ({ className, mode = "light", imageClassName="" }: Props) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image
                src={mode == "light" ? logo : logoInverted}
                alt="Logo SIP"
                width={60}
                height={90}
                className={imageClassName}
                priority
            />
        </div>
    );
}
