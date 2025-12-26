import { reviewRecoveryRequest } from "@/src/api/endpoints/recoveryService";
import { Button } from "./Button";
import { Modal } from "./Modal";

type ApproveRequestModalProps = {
  open: boolean;
  onClose: () => void;
  requestId: string | null;
  onSuccess: () => void;
};

export function ApproveRequestModal({
  open,
  onClose,
  requestId,
  onSuccess,
}: ApproveRequestModalProps) {

  async function handleApprove() {
    if (!requestId) return;

    try {
      await reviewRecoveryRequest({
        idRecovery: requestId,
        statusRecovery: "APPROVED",
      });

      alert("Solicitação aprovada com sucesso!");
      onClose();
      onSuccess();
    } catch (error) {
      alert("Erro ao aprovar solicitação.");
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-2 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Aprovar reivindicação
      </h2>

      <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Tem certeza que deseja aprovar esse pedido de reivindicação?
      </p>

      <div className="flex flex-col gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          onClick={handleApprove}
          className="
            bg-green-200 text-green-800
            hover:bg-green-300
            dark:bg-green-900 dark:text-green-100
            dark:hover:bg-green-800
          "
        >
          Aprovar pedido
        </Button>
      </div>
    </Modal>
  );
}
