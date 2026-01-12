"use client";

import { getRecoveryRequests } from "@/src/api/endpoints/recoveryService";
import { ApproveRequestModal } from "@/src/components/ui/ApproveRequestModal";
import { RejectRequestModal } from "@/src/components/ui/RejectRequestModal";
import { RequestCard } from "@/src/components/ui/RequestCard";
import { RecoveryRequest } from "@/src/types/recovery";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { FilterType } from "@/src/types/item";
import { ScrollableArea } from "@/src/components/ui/ScrollableArea";
import { AdminActionsMobile } from "@/src/components/ui/AdminActionsMobile";

export default function SolicitacoesPage() {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sort, setSort] = useState<string>("requestDate,desc");
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchRequests = useCallback(
    async (pageArg = page, sortArg = sort) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getRecoveryRequests(pageArg, size, sortArg);

        setRequests(response.content);
        setTotalPages(response.totalPages ?? 1);
        setTotalElements(response.totalElements ?? 0);
        setPage(response.number ?? pageArg);

        return response;
      } catch {
        setError("Erro ao carregar solicitações");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [page, size, sort]
  );

  const toggleExpanded = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchRequests(page, sort);
  }, [page, sort, fetchRequests]);

  const handleSelect = (key: FilterType) => {
    const isActive = activeFilters.includes(key);
    setActiveFilters(isActive ? [] : [key]);

    if (key === "dataSolicitacao") {
      setPage(0);

      setSort((prev) =>
        prev === "requestDate,desc" ? "requestDate,asc" : "requestDate,desc"
      );

      return;
    }

    if (key === "dataBusca") {
      setPage(0);

      setSort((prev) => 
        prev === "recoveryDateTime,desc" ? "recoveryDateTime,asc" : "recoveryDateTime,desc");
      
      return;
    }
  };

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  if (loading && requests.length === 0) {
    return (
      <main className="flex-1 px-4 py-6 md:px-8">
        <p className="text-zinc-500">Carregando solicitações...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 px-4 py-6 md:px-8">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-0 flex-1 px-4 py-6 md:px-8">
      <PageHeader title={"Solicitações"} showBell={true} />

      <FilterBar page="requests" active={activeFilters} onSelect={handleSelect} />

      <ScrollableArea>
        <section className="flex flex-col pb-16">
          {requests.length === 0 ? (
            <div
              className="
                flex flex-col items-center justify-center
                rounded-xl p-10 text-center
                text-zinc-500 dark:text-zinc-400
              "
            >
              <p className="text-sm font-medium">Nenhuma solicitação pendente no momento</p>
              <p className="mt-1 text-xs">Quando houver novas solicitações, elas aparecerão aqui.</p>
            </div>
          ) : (
              requests.map((request) => (
                <RequestCard
                  key={request.id}
                  id={request.id}
                  image={request.item.pictures?.[0]?.url}
                  title={request.item.description ?? "Item sem descrição"}
                  user={request.user?.name ?? "Usuário não identificado"}
                  date={new Date(request.requestDate).toLocaleString("pt-BR")}
                  description={request.description}
                  expanded={expandedId === request.id}
                  onToggle={toggleExpanded}
                  onApprove={(id) => { setSelectedRequestId(id); setApproveOpen(true); }}
                  onReject={(id) => { setSelectedRequestId(id); setRejectOpen(true); }}
                />
              )))}
        </section>
      </ScrollableArea>

      <div className="mt-4 flex items-center justify-between gap-3 px-1">
        <button
          type="button"
          disabled={!canPrev || loading}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="
              h-10 rounded-xl border px-4 text-sm font-medium cursor-pointer
              border-zinc-200 text-zinc-900 hover:bg-zinc-100 disabled:opacity-50
              dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800
            "
        >
          Anterior
        </button>

        <div className="text-sm text-center text-zinc-600 dark:text-zinc-300">
          Página <span className="font-medium">{totalElements > 0 ? page + 1 : 0}</span> de{" "}
          <span className="font-medium">{totalPages}</span>
          {totalElements > 0 && (
            <span className="md:ml-2 text-xs text-zinc-500 dark:text-zinc-400">
              <br className="md:hidden" />
              ({totalElements} solicitações)
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!canNext || loading}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          className="
              h-10 rounded-xl border px-4 text-sm font-medium cursor-pointer
              border-zinc-200 text-zinc-900 hover:bg-zinc-100 disabled:opacity-50
              dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800
            "
        >
          Próxima
        </button>
      </div>

      <AdminActionsMobile positionFab="right-8 bottom-40" positionOptions="right-8 bottom-52" />

      <ApproveRequestModal
        open={approveOpen}
        onClose={() => {
          setApproveOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        onSuccess={() => fetchRequests(page, sort)}
      />

      <RejectRequestModal
        open={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        onSuccess={() => fetchRequests(page, sort)}
      />
    </main>
  );
}
