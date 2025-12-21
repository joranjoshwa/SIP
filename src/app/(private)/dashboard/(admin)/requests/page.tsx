"use client";

import { ApproveRequestModal } from "@/src/components/ui/ApproveRequestModal";
import { RejectRequestModal } from "@/src/components/ui/RejectRequestModal";
import { RequestCard } from "@/src/components/ui/RequestCard";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function SolicitacoesPage() {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

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
        <RequestCard
          image="/img/item1.png"
          title="Marmita rosa com detalhes brancos"
          user="Valentina Silveira"
          date="25/06/25 às 09:30h"
          onApprove={() => setApproveOpen(true)}
          onReject={() => setRejectOpen(true)}
        />

        <RequestCard
          image="/img/item2.png"
          title="Caneta stylus branca"
          user="Ana Silva Santos"
          date="25/06/25 às 09:30h"
          onApprove={() => setApproveOpen(true)}
          onReject={() => setRejectOpen(true)}
        />

        <RequestCard
          image="/img/item3.png"
          title="Bolsa preta"
          user="Bárbara S."
          date="25/06/25 às 09:30h"
          onApprove={() => setApproveOpen(true)}
          onReject={() => setRejectOpen(true)}
        />
      </section>

      <ApproveRequestModal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
      />

      <RejectRequestModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
      />
    </main>
  );
}
