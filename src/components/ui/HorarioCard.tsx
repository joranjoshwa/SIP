"use client"

import { Check, X, Clock } from "lucide-react";
import Image from "next/image";

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
  return (
    <div
      className="
        flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm
        dark:bg-neutral-800 transition-colors
        hover:border hover:shadow-md
        hover:border-gray-200 dark:hover:border-neutral-600
      "
    >
      <Image
        src={image}
        width={50}
        height={50}
        alt={title}
        className="rounded-lg w-14 h-14 object-cover"
      />

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
