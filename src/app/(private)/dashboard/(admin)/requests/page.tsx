"use client";

import { getRecoveryRequests } from "@/src/api/endpoints/recoveryService";
import { ApproveRequestModal } from "@/src/components/ui/ApproveRequestModal";
import { RejectRequestModal } from "@/src/components/ui/RejectRequestModal";
import { RequestCard } from "@/src/components/ui/RequestCard";
import { RecoveryRequest } from "@/src/types/recovery";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function SolicitacoesPage() {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchRequests() {
    try {
      setLoading(true);
      setError(null);

      const response = await getRecoveryRequests(0, 10);
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

      <header className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            className="
              flex items-center justify-center
              rounded-lg p-1
              text-zinc-700 hover:bg-zinc-100
              dark:text-zinc-300 dark:hover:bg-zinc-800
            "
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Solicitações
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            className="
              rounded-full bg-green-100 px-4 py-2
              text-sm font-medium text-green-700
              dark:bg-green-900 dark:text-green-300
            "
          >
            Data de solicitação
          </button>

          <button
            className="
              rounded-full border border-zinc-300 px-4 py-2
              text-sm text-zinc-700
              dark:border-zinc-700 dark:text-zinc-300
            "
          >
            Data de busca
          </button>
        </div>
      </header>

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
