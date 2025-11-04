import { ReactNode } from "react"

type Props = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    className?: string;
    headerContent?: ReactNode;
};

export const AuthCard = ({
    children,
    title = "Entre na sua conta",
    subtitle = "Recupere os seus itens perdidos no IFBA Campus Eunápolis sem burocracia",
    className,
    headerContent
}: Props) => {

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen
            px-2 ${className}`}>

            <div className="w-full max-w-sm p-6 rounded-2xl">

                {headerContent  && <div className="flex justify-center mb-4">{headerContent}</div>}

<<<<<<< HEAD:app/src/components/layout/AuthCard.tsx
                <h1 className="text-lg font-bold text-left text-gray-900">{title}</h1>
                <p className="text-sm text-left text-gray-600 mt-1">{subtitle}</p>
=======
                <h2 className="text-lg font-bold text-left text-gray-900 dark:text-gray-100">{title}</h2>
                <p className="text-sm text-left text-gray-600 mt-1 dark:text-gray-300">{subtitle}</p>
>>>>>>> origin/main:src/components/layout/AuthCard.tsx

                <div className="mt-6 space-y-4">{children}</div>
            </div>
        </div>
    );
}
