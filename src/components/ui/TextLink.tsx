import { ReactNode } from "react"

type Props = {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    className?: string;
};

export const TextLink = ({
    children,
    href,
    onClick,
    className
}: Props) => {

    if (href) {
        return(
            <a 
                href={href}
                className={`text-xs text-gray-800 hover:underline ${className}`}
            >
                {children}
            </a>
        );
    }
}