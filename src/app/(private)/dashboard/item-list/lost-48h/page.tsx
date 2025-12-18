"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CarouselItem } from "@/src/types/item";
import { itemFromLast48Hours } from "@/src/api/endpoints/item";
import ItemListLayout from "@/src/components/ui/ItemListLayout";

export default function LostItems48h() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [chosenCategory, setChosenCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await itemFromLast48Hours(chosenCategory ?? "");
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar itens perdidos:", error);
    } finally {
      setLoading(false);
    }
  }, [chosenCategory, loading]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <ItemListLayout
      title="Itens perdidos nas últimas 48h"
      items={items}
      loading={loading}
      emptyMessage="Nenhum item perdido nas últimas 48h."
      scrollAreaRef={scrollAreaRef}
      onCategorySelect={setChosenCategory}
    />
  );
}
