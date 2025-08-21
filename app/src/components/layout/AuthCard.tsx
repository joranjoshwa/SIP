import { ReactNode } from "react"

type Props = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
};

export const AuthCard = ({
    children,
    title,
    subtitle,
    className
}: Props) => {

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen
            px-6 bg-gray-50 ${className}`}>
            
            <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
                <h2 className="text-xl font-bold text-center text-gray-900">{title}</h2>
                <p className="text-sm text-center text-gray-600 mt-1">{subtitle}</p>

                <div className="mt-6 space-y-4">{children}</div>
            </div>
        </div>
    );
}