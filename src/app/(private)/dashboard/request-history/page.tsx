"use client";

import { useEffect, useState } from "react";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { SearchBar } from "@/src/components/ui/SearchBar";
import { FilterType, ItemStatus } from "@/src/types/item";
import { getRecoveriesByUser } from "@/src/api/endpoints/recovery";
import { getTokenFromCookie, extractEmailFromToken } from "@/src/utils/token";
import type { RecoveryHistoryApiResponse, RecoveryHistoryItem, RecoveryResponse } from "@/src/types/recovery";
import { HistoryRequestList } from "@/src/components/ui/HistoryRequestList";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";

export const mapRecoveryResponseToHistoryItems = (
    page: RecoveryHistoryApiResponse
): RecoveryHistoryItem[] =>
    page.recovery.map((r) => ({
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
        requester: {
            name: page.user.name,
            email: page.user.email,
            profileImageUrl: page.user.profileImageUrl,
        },
    }));


export default function RequestHistory() {
    const [data, setData] = useState<RecoveryHistoryItem[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getTokenFromCookie();
        if (!token) return;

        const email = extractEmailFromToken(token);
        if (!email) return;

        const load = async () => {
            try {
                const response = await getRecoveriesByUser(email);
                const hi = mapRecoveryResponseToHistoryItems(response);
                setData(hi);
            } catch (err) {
                console.error("Failed to load recoveries", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <main className="min-h-0 flex flex-col p-2">
            <PageHeader title="Histórico de solicitações" />

            <SearchBar
                className="mb-2"
                handleSearch={(itemName: string) => {
                    console.log("search:", itemName);
                }}
            />

            <FilterBar
                active={[]}
                onSelect={(value: FilterType) => {
                    console.log("filter:", value);
                }}
            />

            {/* Debug / placeholder */}
            {loading && <p className="mt-4 text-sm text-zinc-500">Carregando…</p>}

            <ScrollableArea className="pb-16">
                {!loading &&
                data &&
                data.map((item) => (<HistoryRequestList
                    key={item.recoveryId}
                    title={item.title}
                    imageUrl={item.imageUrl}
                    status={item.status}
                    pickupIso={item.pickup}
                    description={item.description}
                />))}
            </ScrollableArea>
        </main>
    );
}
