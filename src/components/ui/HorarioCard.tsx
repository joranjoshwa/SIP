"use client";

import { Check, X, Clock, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  user: string;
  time: string;
  image?: string;
  showActions?: boolean;
  onReject?: () => void;
  onApprove?: () => void;
};

export default function HorarioCard({
  title,
  user,
  time,
  image,
  showActions = false,
  onReject,
  onApprove,
}: Props) {
  const [hasError, setHasError] = useState(false);
  const validPhoto = !!image?.trim() && !hasError;

  return (
    <div
      className={[
        "flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm",
        "dark:bg-neutral-800 transition-colors",
        "border border-transparent hover:border-gray-200 dark:hover:border-neutral-600 hover:shadow-md",
      ].join(" ")}
    >
      
      <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-700 grid place-items-center">
        {validPhoto ? (
          <Image
            src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL as string + image as string}
            alt={title}
            fill
            sizes="48px"
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <ImageOff className="w-5 h-5 text-gray-400 dark:text-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm dark:text-gray-100 truncate">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
          Reivindicado por <span className="font-medium">{user}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm shrink-0">
        <Clock size={16} />
        <span>{time}</span>
      </div>

      {showActions && (
        <div className="flex gap-3 ml-2 shrink-0">
          <button
            type="button"
            onClick={onReject}
            aria-label="Recusar"
            className="p-2 rounded-lg text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={onApprove}
            aria-label="Aprovar"
            className="p-2 rounded-lg text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
          >
            <Check size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
