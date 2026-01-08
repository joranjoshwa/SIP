"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

import { getRecoveries } from "@/src/api/endpoints/recovery";
import { AdminActionsMobile } from "@/src/components/ui/AdminActionsMobile";
import DateNav from "@/src/components/ui/DateNav";
import HorarioGroup, { HorarioItem } from "@/src/components/ui/HorarioGroup";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";

import { formatGroupLabel } from "@/src/utils/formatGroupLabel";
import { getNextDays } from "@/src/utils/getNextDays";

type HorarioItemWithDate = HorarioItem & { _rawDate: Date };

export default function Schedule() {
  const days = getNextDays(8);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [allItems, setAllItems] = useState<HorarioItemWithDate[]>([]);
  const [groupedItems, setGroupedItems] = useState<
    { label: string; items: HorarioItem[] }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const data = await getRecoveries(0, 50);

        const items: HorarioItemWithDate[] = data.content.map((entry: any) => {
          const requestDate = new Date(entry.requestDate);

          return {
            id: entry.id,
            title: entry.item?.description || "Item",
            user: entry.user?.name || "Usuário não informado",
            time: requestDate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            image: entry.item?.pictures?.[0]?.url || "/placeholder.jpg",
            _rawDate: requestDate,
          };
        });

        setAllItems(items);
      } catch (err: any) {
        setError(`Erro ao carregar os dados: ${err?.message || String(err)}`);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = allItems.filter(
      (item) => item._rawDate.getDate() === selectedDay
    );

    const map = new Map<string, HorarioItemWithDate[]>();

    filtered.forEach((item) => {
      const label = formatGroupLabel(item._rawDate);

      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(item);
    });

    const groups = [...map.entries()].map(([label, items]) => ({
      label,
      items,
    }));

    setGroupedItems(groups);
  }, [selectedDay, allItems]);

  return (
    <section className="p-5 transition-colors flex flex-col min-h-0">
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
        Horários
      </h1>

      <AdminActionsMobile />

      <DateNav
        dates={days}
        current={selectedDay}
        onSelectDate={setSelectedDay}
      />

      <ScrollableArea>
        <div>
          {groupedItems.map((group, i) => (
            <HorarioGroup
              key={i}
              label={group.label}
              items={group.items}
            />
          ))}
        </div>
      </ScrollableArea>

      {!loading && groupedItems.length === 0 && (
        <div className="flex flex-col items-center mt-10 text-gray-500 dark:text-gray-400">
          <Calendar size={40} className="mb-2" />
          <p>Nenhum horário marcado para este dia.</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500">
          {error}
        </p>
      )}
    </section>
  );
}
