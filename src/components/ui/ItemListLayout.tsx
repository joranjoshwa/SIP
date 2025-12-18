"use client";

import { ReactNode, RefObject } from "react";
import { CategoryItem } from "@/src/components/ui/CategoryItem";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import ItemCard from "@/src/components/ui/ItemCard";
import { CarouselItem } from "@/src/types/item";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ItemListLayoutProps = {
  title: string;
  items: CarouselItem[];
  loading: boolean;
  emptyMessage: string;
  scrollAreaRef: RefObject<HTMLDivElement | null>;
  onCategorySelect: (category: string | null) => void;
  backHref?: string;
};

export default function ItemListLayout({
  title,
  items,
  loading,
  emptyMessage,
  scrollAreaRef,
  onCategorySelect,
  backHref,
}: ItemListLayoutProps) {
  return (
    <div className="flex flex-col bg-white text-gray-900 dark:bg-neutral-900 dark:text-neutral-100 min-h-0">
      
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white/70 px-5 pt-3 backdrop-blur-sm dark:bg-neutral-900/70">

      {backHref && (
        <Link
        href={backHref}
        aria-label="Voltar"
        className="
            p-2 -ml-2
            rounded-full
            text-gray-700 dark:text-neutral-200
            hover:bg-gray-100 dark:hover:bg-neutral-800
            transition
        "
        >
            <ArrowLeft className="w-5 h-5" />
        </Link>
  )}

        <h1 className="text-lg font-semibold md:text-2xl">
          {title}
        </h1>
      </header>

      <section className="p-5 pb-0 pt-2 flex-shrink-0">
        <CategoryItem handleCategorySelection={onCategorySelect} />
      </section>

      <ScrollableArea>
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto px-5 pb-5 pt-3 scroll-smooth"
        >
          {items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-3 justify-center place-items-center mt-4">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  id={item.id}
                  picture={item.picture}
                  description={item.description}
                  time={item.time}
                />
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 text-center">
                {emptyMessage}
              </p>
            )
          )}

          {loading && (
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-neutral-400">
              Carregando itens…
            </p>
          )}
        </div>
      </ScrollableArea>
    </div>
  );
}
