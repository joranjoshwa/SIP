type Props = {
    image: string;
    title: string;
    user: string;
    date: string;
};

export function RequestCard({ image, title, user, date }: Props) {
    return (
        <div className="
        flex items-center gap-4
        rounded-xl border border-zinc-200 dark:border-zinc-800
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
                    className="
              flex h-9 w-9 items-center justify-center
              rounded-full border border-red-200 dark:border-red-800
              text-red-500 hover:bg-red-50 dark:hover:bg-red-950
            "
                >
                    ✕
                </button>

                <button
                    className="
              flex h-9 w-9 items-center justify-center
              rounded-full border border-green-200 dark:border-green-800
              text-green-500 hover:bg-green-50 dark:hover:bg-green-950
            "
                >
                    ✓
                </button>
            </div>
        </div>
    );
}
