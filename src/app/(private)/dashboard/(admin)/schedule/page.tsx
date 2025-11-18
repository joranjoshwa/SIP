"use client";

import { AdminActionsMobile } from "@/src/components/ui/AdminActionsMobile";
import DateNav from "@/src/components/ui/DateNav";
import HorarioGroup, { HorarioItem } from "@/src/components/ui/HorarioGroup";

export default function Schedule() {
  const groupedItems: {
    label: string;
    items: HorarioItem[];
  }[] = [
    {
      label: "20 jun · Hoje · Sexta",
      items: [
        {
          id: 1,
          title: "Vasilha tupperware estampada com tampa laranja",
          user: "Mathias Figueiredo",
          time: "09:30h",
          image: "/tupper.jpg",
        },
        {
          id: 2,
          title: "Tênis feminino da nike tamanho 34",
          user: "Letícia Martins",
          time: "09:40h",
          image: "/tenis.jpg",
        },
      ],
    },
    {
      label: "24 jun · Terça",
      items: [
        {
          id: 3,
          title: "Calça jeans 44 com lavagem clara",
          user: "Guilherme Silva",
          time: "08:15h",
          image: "/calca.jpg",
        },
      ],
    },
    {
      label: "25 jun · Quarta",
      items: [
        {
          id: 4,
          title: "Relógio bege",
          user: "Luiza Garcia",
          time: "08:15h",
          image: "/relogio.jpg",
        },
        {
          id: 5,
          title: "Caneta stylus branca",
          user: "Ana Silva Santos",
          time: "08:55h",
          image: "/caneta.jpg",
          showActions: true,
        },
      ],
    },
  ];

  return (
    <section className="p-5">

      <AdminActionsMobile />

      <DateNav dates={[20, 21, 22, 23, 24, 25, 26, 27]} current={20} />

      <div className="mt-6">
        {groupedItems.map((group, i) => (
          <HorarioGroup key={i} label={group.label} items={group.items} />
        ))}
      </div>
    </section>
  );
}
