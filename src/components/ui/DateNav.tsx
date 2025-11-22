"use client"

type Props = {
  dates: number[];
  current: number;
};

export default function DateNav({ dates, current }: Props) {
  return (
    <div className="w-full flex justify-between md:max-w-[95%] overflow-x-auto pb-4 mb-6 transition-colors">
      {dates.map((d, i) => (
        <button
          key={i}
          className="flex flex-col items-center text-sm"
        >
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full transition
                    ${d === current ? "bg-green-100 text-green-700 font-semibold dark:bg-green-900 dark:text-green-200"
                    : "bg-transparent text-gray-500 dark:text-gray-400"}
            `}
          >
            {d}
          </span>
        </button>
      ))}
    </div>
  );
}
