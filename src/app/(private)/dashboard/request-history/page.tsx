"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { SearchBar } from "@/src/components/ui/SearchBar";
import { FilterType } from "@/src/types/item";
import { getRecoveriesByUser } from "@/src/api/endpoints/recovery";
import { getTokenFromCookie, extractEmailFromToken } from "@/src/utils/token";
import type { RecoveryHistoryApiResponse, RecoveryHistoryItem } from "@/src/types/recovery";
import { HistoryRequestList } from "@/src/components/ui/HistoryRequestList";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { SearchFilter } from "@/src/components/ui/SearchFilter";

const mapRecoveryResponseToHistoryItems = (
    page: RecoveryHistoryApiResponse
): RecoveryHistoryItem[] =>
    page.content.flatMap((group) =>
        group.recovery.map((r) => ({
            recoveryId: r.id,
            itemId: r.item.id,
            title: r.item.description,
            status: r.status,
            description: r.description,
            pickup: r.pickupDate,
            createdAtIso: r.requestDate,
            imageUrl: r.item.pictures?.[0]?.url ?? null,
            code: r.item.code,
            category: r.item.category,
            area: r.item.area,
            dayPeriod: r.item.dayPeriod,
            itemStatus: r.item.status,
        }))
    );

type LocalFilters = {
    category: string[];
    dateStart: Date | null;
    dateEnd: Date | null;
    status: RequestStatus | null;
};

const PAGE_SIZE = 20;

export default function RequestHistory() {
    const [data, setData] = useState<RecoveryHistoryItem[]>([]);
    const [loading, setLoading] = useState(true); 
    const [loadingMore, setLoadingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
    const filterRef = useRef<HTMLDivElement>(null);

    const [query, setQuery] = useState<string>("");

    const [filters, setFilters] = useState<LocalFilters>({
        category: [],
        dateStart: null,
        dateEnd: null,
        status: null,
    });

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const mapAndAppend = useCallback((response: RecoveryHistoryApiResponse, mode: "replace" | "append") => {
        const hi = mapRecoveryResponseToHistoryItems(response);

        setHasMore(!response.last);
        setPageNumber(response.number);

        setData((prev) => {
            if (mode === "replace") return hi;

            const seen = new Set(prev.map((x) => x.recoveryId));
            const merged = [...prev];
            for (const item of hi) {
                if (!seen.has(item.recoveryId)) merged.push(item);
            }
            return merged;
        });
    }, []);

    const fetchPage = useCallback(
        async (opts: { page: number; mode: "replace" | "append"; qOverride?: string }) => {
            const token = getTokenFromCookie();
            if (!token) return;

            const email = extractEmailFromToken(token);
            if (!email) return;

            const qToSend = (opts.qOverride ?? query).trim();

            try {
                if (opts.mode === "replace") setLoading(true);
                else setLoadingMore(true);

                const response = await getRecoveriesByUser(email, {
                    ...filters,
                    q: qToSend || undefined,
                    page: opts.page,
                    size: PAGE_SIZE,
                });

                mapAndAppend(response, opts.mode);
            } catch (err) {
                console.error("Failed to load recoveries", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
                setShowFilters(false);
            }
        },
        [filters, query, mapAndAppend]
    );

    const toggleFilter = () => setShowFilters((prev) => !prev);

    const updateFilters = (patch: Partial<LocalFilters>) => {
        setFilters((prev) => ({ ...prev, ...patch }));
    };

    const handleCategorySelection = (categories: string[]) =>
        updateFilters({ category: categories });

    const handleDateChange = (start: Date | null, end: Date | null) =>
        updateFilters({ dateStart: start, dateEnd: end });

    const handleStatusChange = (status: RequestStatus | null) => updateFilters({ status });

    const handleRunSearch = (query: string) => {
        setQuery(query);
        onSubmitFilters();
    }

    const handleCleanFilters = () => {
        setFilters({ category: [], dateStart: null, dateEnd: null, status: null });
        setActiveFilters([]);
        setShowFilters(false);

        setQuery("");
        onSubmitFilters("");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                filterRef.current &&
                !filterRef.current.contains(target) &&
                !target.closest("input") &&
                !target.closest('button[aria-hidden="true"]')
            ) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFilters]);

    useEffect(() => {
        const af: FilterType[] = [];
        if (filters.category.length) af.push("categoria");
        if (filters.dateStart || filters.dateEnd) af.push("data");
        if (filters.status) af.push("status");
        setActiveFilters(af);
    }, [filters]);

    useEffect(() => {
        fetchPage({ page: 0, mode: "replace" });
    }, []);

    const onSubmitFilters = useCallback(async (qOverride?: string) => {
        setHasMore(true);
        setPageNumber(0);

        await fetchPage({ page: 0, mode: "replace", qOverride });
    }, [fetchPage]);

    useEffect(() => {
        if (!loadMoreRef.current) return;

        const el = loadMoreRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (!first?.isIntersecting) return;

                if (loading || loadingMore) return;
                if (!hasMore) return;

                fetchPage({ page: pageNumber + 1, mode: "append" });
            },
            { root: null, rootMargin: "200px", threshold: 0.01 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchPage, hasMore, loading, loadingMore, pageNumber]);

    return (
        <main className="min-h-0 flex flex-col p-2">
            <PageHeader title="Histórico de solicitações" />

            <SearchBar
                className="mb-2"
                handleRunSearch={handleRunSearch}
                handleSearch={setQuery}
            />

            <div className="relative flex flex-col flex-1 min-h-0">
                <div
                    id="filterBar"
                    className={`transition-opacity duration-300 ${showFilters ? "opacity-0 pointer-events-none" : "opacity-100"
                        }`}
                >
                    <FilterBar
                        page="requestsSelf"
                        active={activeFilters}
                        onSelect={toggleFilter}
                    />
                </div>

                <div
                    id="filterForm"
                    ref={filterRef}
                    className={`absolute top-0 left-0 right-0 z-50 bottom-0 bg-white dark:bg-neutral-900 sm:bg-transparent sm:dark:bg-transparent
                            lg:max-w-[450px] w-full transition-all duration-300 transform p-2 ${showFilters
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                        }`}
                >
                    <div className="filter-scroll overscroll-y-contain touch-pan-y rounded-xl bg-white dark:bg-neutral-900">
                        <SearchFilter
                            filterGroup={"requestsSelf"}
                            handleCategorySelection={handleCategorySelection}
                            handleDateSelection={handleDateChange}
                            handleStatusChange={handleStatusChange}
                            handleSubmit={onSubmitFilters}
                            handleCleanFilters={handleCleanFilters}
                        />
                    </div>
                </div>

                {loading && (
                    <p className="mt-4 text-sm text-zinc-500 dark:text-neutral-400">
                        Carregando…
                    </p>
                )}

                <ScrollableArea className="pb-16 mt-2">
                    {!loading &&
                        data.map((item) => (
                            <HistoryRequestList
                                key={item.recoveryId}
                                title={item.title}
                                imageUrl={item.imageUrl}
                                status={item.status}
                                pickupIso={item.pickup}
                                description={item.description}
                            />
                        ))}

                    <div ref={loadMoreRef} className="h-10" />

                    {loadingMore && (
                        <p className="mt-2 text-sm text-zinc-500 dark:text-neutral-400">
                            Carregando mais…
                        </p>
                    )}
                </ScrollableArea>
            </div>
        </main>
    );
}
