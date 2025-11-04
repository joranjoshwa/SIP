"use client"
import { AdminActionsMobile } from "@/src/components/ui/AdminActionsMobile";

export default function Schedule() {
  return (
    <section className="p-5">
      <h1 className="text-2xl font-semibold mb-4">Horários</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Aqui você pode visualizar os horários para recuperação de itens.
      </p>
      <AdminActionsMobile />
    </section>
  );
}
