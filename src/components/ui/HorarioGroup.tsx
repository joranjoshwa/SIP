"use client"

import HorarioCard from "./HorarioCard";

export type HorarioItem = {
  id: number;
  title: string;
  user: string;
  time: string;
  image: string;
  showActions?: boolean;
};

type Props = {
  label: string;
  items: HorarioItem[];
};

export default function HorarioGroup({ label, items }: Props) {
  return (
    <div className="mb-8">
      <p className="text-gray-700 font-medium mb-3">{label}</p>

      <div className="space-y-4">
        {items.map(item => (
          <HorarioCard
            key={item.id}
            title={item.title}
            user={item.user}
            time={item.time}
            image={item.image}
            showActions={item.showActions}
          />
        ))}
      </div>
    </div>
  );
}
