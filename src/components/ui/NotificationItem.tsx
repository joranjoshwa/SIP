import Link from "next/link";

type Props = {
    id: string,
    title: string;
    message: string;
    time?: string;
    isNew?: boolean;
}

export const NotificationItem = ({ id, title, message, time, isNew = false }: Props) => {
    return (
        <Link href={`/dashboard/item/${id}`} className="border-b block border-gray-200 dark:border-neutral-700 py-3 px-2">
            <div className="flex items-start gap-2">
                {isNew && (
                    <span className="mt-2 h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></span>
                )}
                <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-900 dark:text-neutral-100 text-sm">
                        {title}
                    </h4>
                    <p className="text-gray-600 dark:text-neutral-300 text-sm">
                        {message}
                    </p>
                    {time && (
                        <span className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                            {time}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

