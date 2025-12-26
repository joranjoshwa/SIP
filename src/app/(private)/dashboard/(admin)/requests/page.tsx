"use client";

import { getRecoveryRequests } from "@/src/api/endpoints/recoveryService";
import { ApproveRequestModal } from "@/src/components/ui/ApproveRequestModal";
import { RejectRequestModal } from "@/src/components/ui/RejectRequestModal";
import { RequestCard } from "@/src/components/ui/RequestCard";
import { RecoveryRequest } from "@/src/types/recovery";
import { useState, useEffect } from "react";
import { PageHeader } from "@/src/components/ui/PageHeader";
import { FilterBar } from "@/src/components/ui/FilterBar";
import { FilterType } from "@/src/types/item";

export default function SolicitacoesPage() {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRequests(sort: string[] = ["requestDate,desc"]) {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecoveryRequests(0, 10, sort);
      setRequests(response.content);
    } catch {
      setError("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
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
    <main className="flex-1 px-4 py-6 md:px-8">

      <PageHeader title={"Solicitações"} />
      <FilterBar page="requests" active={[]} onSelect={function (value: FilterType): void {
        fetchRequests(["requestDate,asc"]);
      } } />

      <section className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <div
            className="
              flex flex-col items-center justify-center
              rounded-xl p-10
              text-center
              text-zinc-500
              dark:border-zinc-700 dark:text-zinc-400
            "
          >
            <p className="text-sm font-medium">
              Nenhuma solicitação pendente no momento
            </p>
            <p className="mt-1 text-xs">
              Quando houver novas solicitações, elas aparecerão aqui.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <RequestCard
              key={request.id}
              id={request.id}
              image={request.item.pictures?.[0]?.url ?? "/img/placeholder.png"}
              title={request.item.description ?? "Item sem descrição"}
              user={request.user?.name ?? "Usuário não identificado"}
              date={new Date(request.requestDate).toLocaleString("pt-BR")}
              onApprove={(id) => {
                setSelectedRequestId(id);
                setApproveOpen(true);
              }}
              onReject={(id) => {
                setSelectedRequestId(id);
                setRejectOpen(true);
              }}
            />
          ))
        )}
      </section>

      <ApproveRequestModal
        open={approveOpen}
        onClose={() => {
          setApproveOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        onSuccess={fetchRequests}
      />

      <RejectRequestModal
        open={rejectOpen}
        onClose={() => {
          setRejectOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId}
        onSuccess={fetchRequests}
      />
    </main>
  );
}
