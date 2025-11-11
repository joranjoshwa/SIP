"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { ItemCarousel } from "@/src/components/ui/ItemCarousel";
import { CarouselItem, Item, UUID } from "@/src/types/item";
import { itemForDonation } from "@/src/api/endpoints/item";

export default function DonationItems() {
  const router = useRouter();

  const [items, setItems] = useState<CarouselItem[]>([]);
  const [chosenCategory, setChosenCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fetchDonationItems = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        const data = await itemForDonation(chosenCategory ?? "", page, 10);

        setItems((prev) => {
          const combined = reset ? data : [...prev, ...data];
          const unique = Array.from(new Map(combined.map((i) => [i.id, i])).values());

          return unique;

        });

        setHasMore(data.length === 10);

      } catch (error) {
        console.error("Erro ao carregar itens para doação: ", error);

      } finally {
        setLoading(false);
      }

    },
    [chosenCategory, page, loading]);
  };

  useEffect(() => {
    setPage(0);
    fetchDonationItems(true);
  }, [page]);

  useEffect(() => {
    if (page > 0) fetchDonationItems(false)
  }, [page]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
      
      if (nearBottom) setPage((prev) => prev + 1);
    };

    el.addEventListener("scroll", handleScroll);
  })

  const handleCategorySelection = (category: string | null) => {
    setChosenCategory(category);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100">

      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white/70 px-5 py-4 backdrop-blur-sm dark:bg-neutral-900/70">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold md:text-2xl">Itens para Doação</h1>
      </header>


      <section className="p-5 pb-0">
        <CategoryItem handleCategorySelection={handleCategorySelection} />
      </section>


      <section className="p-5 pt-3">
        {loading && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Carregando itens…
          </p>
        )}

        {!loading && items.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Nenhum item disponível para doação no momento.
          </p>
        )}

        {!loading && items.length > 0 && (
          <ItemCarousel title="" items={items} />
        )}
      </section>
    </div>
  );
}
