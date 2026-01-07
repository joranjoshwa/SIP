"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CarouselItem } from "@/src/types/item";
import { itemAboutToBeDonated } from "@/src/api/endpoints/item";
import ItemListLayout from "@/src/components/ui/ItemListLayout";

export default function AboutToBeDonatedItems() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [chosenCategory, setChosenCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);

    try {
      const data = await itemAboutToBeDonated(chosenCategory ?? "", 100);
      setItems(data);
    } catch (error) {
      console.error("Erro ao carregar itens quase indo para doação:", error);
    } finally {
      setLoading(false);
    }
  }, [chosenCategory]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <ItemListLayout
      title="Itens prestes a serem doados"
      items={items}
      loading={loading}
      emptyMessage="Nenhum item próximo de doação no momento."
      scrollAreaRef={scrollAreaRef}
      onCategorySelect={setChosenCategory}
      backHref="/dashboard"
    />
  );
}
