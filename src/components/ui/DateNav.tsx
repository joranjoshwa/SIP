"use client"

type Props = {
  dates: number[];
  current: number;
};

export default function DateNav({ dates, current }: Props) {
  return (
    <div className="w-full flex justify-between md:max-w-[95%] overflow-x-auto pb-4 mb-6">
      {dates.map((d, i) => (
        <button
          key={i}
          className="flex flex-col items-center text-sm"
        >
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full
                    ${d === current ? "bg-green-100 text-green-700 font-semibold" : "bg-transparent text-gray-500"}
            `}
          >
            {d}
          </span>
        </button>
      ))}
    </div>
  );
}
