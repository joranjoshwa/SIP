import { HorarioItem } from "@/src/components/ui/HorarioGroup";
import { formatGroupLabel } from "./formatGroupLabel";

export type HorarioItemWithDate = HorarioItem & {
  _rawDate: Date;
};

export function groupHorariosByDay(
  day: number,
  items: HorarioItemWithDate[]
) {
  const filtered = items.filter(
    (item) => item._rawDate.getDate() === day
  );

  const map = new Map<string, HorarioItem[]>();

  filtered.forEach((item) => {
    const label = formatGroupLabel(item._rawDate);

    if (!map.has(label)) {
      map.set(label, []);
    }

    map.get(label)!.push(item);
  });

  return Array.from(map.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}
