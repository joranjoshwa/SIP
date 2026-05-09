"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

import { getRecoverySchedule, getRecoverySelf } from "@/src/api/endpoints/recovery";
import { AdminActionsMobile } from "@/src/components/ui/AdminActionsMobile";
import DateNav from "@/src/components/ui/DateNav";
import HorarioGroup, { HorarioItem } from "@/src/components/ui/HorarioGroup";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { formatGroupLabel } from "@/src/utils/formatGroupLabel";
import { getNextDays } from "@/src/utils/getNextDays";
import { extractEmailFromToken } from "@/src/api/axios";
import { extractRoleFromToken } from "@/src/utils/token";

type HorarioItemWithDate = HorarioItem & { _rawDate: Date };
type Nullable<T> = T | null;

const isNotNull = <T,>(v: Nullable<T>): v is T => v !== null;

export default function Schedule() {
  const days = getNextDays(8);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [allItems, setAllItems] = useState<HorarioItemWithDate[]>([]);
  const [groupedItems, setGroupedItems] = useState<
    { label: string; items: HorarioItem[] }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Usuário não autenticado");
        }

        const email = extractEmailFromToken(token);
        if (!email) {
          throw new Error("Não foi possível extrair o email do token");
        }

        const role = extractRoleFromToken(token);

        let rawRecoveries: any[] = [];

        if (role === "ADMIN") {
          const data = await getRecoverySchedule(token, 0, 0);
          rawRecoveries = data?.content ?? [];
        } else {
          const data = await getRecoverySelf(token, email, {
            page: 0,
            size: 50,
          });

          rawRecoveries =
            data?.content?.flatMap(
              (group: any) => group.recovery
            ) ?? [];
        }

        const items: HorarioItemWithDate[] = rawRecoveries
          .filter((entry: any) => entry.status === "APPROVED")
          .map((entry: any): Nullable<HorarioItemWithDate> => {
            const rawDate = entry.pickupDate ?? entry.requestDate;
            const pickupDate = new Date(rawDate);

            if (!rawDate || Number.isNaN(pickupDate.getTime())) return null;

            return {
              id: entry.id,
              itemId: entry.item.id,
              title: entry?.item?.description ?? "Item",
              user:
                role === "ADMIN"
                  ? entry?.user?.name ?? "Usuário não informado"
                  : "Você",
              time: pickupDate.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              image: entry?.item?.pictures?.[0]?.url ?`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${entry?.item?.pictures?.[0]?.url}` : "/placeholder.jpg",
              _rawDate: pickupDate,
            };
          })
          .filter(isNotNull);

        items.sort((a, b) => a._rawDate.getTime() - b._rawDate.getTime());

        setAllItems(items);

        console.log("Recoveries normalizadas:", rawRecoveries);
      } catch (err: any) {
        console.error("Erro completo:", err);
        setError("Erro ao carregar os horários");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = selectedDay === null
      ? allItems
      : allItems.filter((item) => {
        const d = item._rawDate;
        const selectedDate = new Date();
        selectedDate.setDate(selectedDay);

        return (
          d.getDate() === selectedDate.getDate() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        );
      });

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
        onSelectDate={(day) =>
          setSelectedDay((prev) => (prev === day ? null : day))}
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

      {!loading && groupedItems.length === 0 && !error && (
        <div className="flex flex-col items-center mt-10 text-gray-500 dark:text-gray-400">
          <Calendar size={40} className="mb-2" />
          <p>Nenhum horário marcado para este dia.</p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-500 text-center">
          {error}
        </p>
      )}
    </section>
  );
}
