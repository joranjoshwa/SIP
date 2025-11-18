"use client"

type Props = {
  dates: number[];
  current: number;
};

export default function DateNav({ dates, current }: Props) {
  return (
    <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 mb-6 border-b">
      {dates.map((d, i) => (
        <button
          key={i}
          className="flex flex-col items-center text-sm"
        >
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full
                    ${d === current ? "bg-green-100 text-green-700 font-semibold" : "bg-gray-100 text-gray-500"}
            `}
          >
            {d}
          </span>
        </button>
      ))}
    </div>
  );
}
