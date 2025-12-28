import { Check, X, Clock3, ImageOff } from "lucide-react";
import Image from "next/image";

type Props = {
  id: string;
  image?: string;
  title: string;
  user: string;
  date: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function RequestCard({
  id,
  image,
  title,
  user,
  date,
  onApprove,
  onReject,
}: Props) {
  return (
    <div
      className="
        flex items-center gap-3
        px-3 py-2
        bg-white dark:bg-transparent
        dark:border-b dark:border-zinc-800
      "
    >
      {/* Thumb */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="56px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>

        <p className="truncate text-[12px] text-zinc-600 dark:text-zinc-300">
          Solicitado por <span className="font-medium">{user}</span>
        </p>

        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
          <Clock3 className="h-3.5 w-3.5" />
          <span className="truncate">{date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pl-2">
        <button
          type="button"
          aria-label="Rejeitar"
          onClick={() => onReject(id)}
          className="
            inline-flex h-9 w-9 items-center justify-center rounded-full
            text-red-600 dark:text-red-500
            hover:bg-red-50 dark:hover:bg-red-950/40
            active:scale-[0.98] transition
          "
        >
          <X className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Aprovar"
          onClick={() => onApprove(id)}
          className="
            inline-flex h-9 w-9 items-center justify-center rounded-full
            text-emerald-600 dark:text-emerald-500
            hover:bg-emerald-50 dark:hover:bg-emerald-950/40
            active:scale-[0.98] transition
          "
        >
          <Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
