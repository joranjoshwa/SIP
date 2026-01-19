import { Check, X, Clock3, ImageOff, ChevronDown } from "lucide-react";
import Image from "next/image";

type Props = {
  id: string;
  image?: string;
  title: string;
  user: string;
  date: string;
  description?: string;
  expanded?: boolean;
  onToggle?: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

export function RequestCard({
  id,
  image,
  title,
  user,
  date,
  description,
  expanded = false,
  onToggle,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="border-b border-zinc-200/80 dark:border-zinc-800">
      {/* Row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle?.(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle?.(id);
          }
        }}
        className="
          w-full text-left
          flex items-center gap-3
          px-3 py-2
          bg-white dark:bg-transparent
          transition-colors
          cursor-pointer
          select-none
        "
      >
        {/* Thumb */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          {image ? (
            <Image src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + image} alt={title} fill sizes="56px" className="object-cover" />
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

        {/* Actions + chevron */}
        <div className="flex items-center gap-2 pl-2">
          <button
            type="button"
            aria-label="Rejeitar"
            onClick={(e) => {
              e.stopPropagation();
              onReject(id);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              onApprove(id);
            }}
            className="
              inline-flex h-9 w-9 items-center justify-center rounded-full
              text-emerald-600 dark:text-emerald-500
              hover:bg-emerald-50 dark:hover:bg-emerald-950/40
              active:scale-[0.98] transition
            "
          >
            <Check className="h-5 w-5" />
          </button>

          <ChevronDown
            className={[
              "ml-1 h-5 w-5 text-zinc-400 transition-transform",
              expanded ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
        </div>
      </div>

      {/* Collapsible content */}
      <div
        className={[
          "overflow-hidden px-3",
          "transition-[max-height,opacity] duration-200 ease-out",
          expanded ? "max-h-40 opacity-100 pb-3" : "max-h-0 opacity-0 pb-0",
        ].join(" ")}
      >
        <div className="rounded-xl bg-zinc-50 dark:bg-white/5 px-4 py-3">
          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
            Descrição da solicitação
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 break-words">
            {description?.trim() ? description : "Sem descrição."}
          </p>
        </div>
      </div>
    </div>
  );
}
