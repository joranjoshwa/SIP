type Props = {
    image: string;
    title: string;
    user: string;
    date: string;
    onApprove: () => void;
    onReject: () => void;
};

export function RequestCard({ image, title, user, date, onApprove, onReject }: Props) {
    return (
        <div className="
        flex items-center gap-4
        rounded-xl
        bg-white dark:bg-zinc-900
        p-4
      ">

            <img
                src={image}
                alt={title}
                className="h-14 w-14 rounded-lg object-cover"
            />

            <div className="flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {title}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Solicitado por {user}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {date}
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onReject}
                    className="
              flex h-9 w-9 items-center justify-center
              rounded-full 
              text-red-500 hover:bg-red-50 dark:hover:bg-red-950
            "
                >
                    ✕
                </button>

                <button
                    onClick={onApprove}
                    className="
              flex h-9 w-9 items-center justify-center
              rounded-full 
              text-green-500 hover:bg-green-50 dark:hover:bg-green-950
            "
                >
                    ✓
                </button>
            </div>
        </div>
    );
}
