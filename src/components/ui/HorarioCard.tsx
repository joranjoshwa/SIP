"use client"

import { Check, X, Clock, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  user: string;
  time: string;
  image: string;
  showActions?: boolean;
};

export default function HorarioCard({
  title,
  user,
  time,
  image,
  showActions
}: Props) {

  const [hasError, setHasError] = useState(false);
  const validPhoto = image && image.trim() !== "" && !hasError;

  return (
    <div
      className="
        flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm
        dark:bg-neutral-800 transition-colors
        hover:border hover:shadow-md
        hover:border-gray-200 dark:hover:border-neutral-600
      "
    >
      {validPhoto ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
          onError={() => setHasError(true)}
        />
      ) : (
        <ImageOff className="w-6 h-6 text-gray-400 dark:text-gray-500" />
      )}

      <div className="flex-1">
        <p className="font-medium text-gray-800 text-sm dark:text-gray-100">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-300">
          Reivindicado por <span className="font-medium">{user}</span>
        </p>
      </div>

      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 text-sm">
        <Clock size={16} />
        {time}
      </div>

      {showActions && (
        <div className="flex gap-3 ml-2">
          <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
            <X size={20} />
          </button>
          <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
            <Check size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
