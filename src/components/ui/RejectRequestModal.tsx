import { reviewRecoveryRequest } from "@/src/api/endpoints/recoveryService";
import { Button } from "./Button";
import { Modal } from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  requestId: string | null;
  onSuccess: () => void;
};

export function RejectRequestModal({
  open,
  onClose,
  requestId,
  onSuccess,
}: Props) {

  async function handleReject() {
    if (!requestId) return;

    try {
      await reviewRecoveryRequest({
        idRecovery: requestId,
        statusRecovery: "REFUSED",
      });

      onClose();
      onSuccess();
    } catch (error) {
      alert("Erro ao rejeitar solicitação.");
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-2 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Rejeitar reivindicação
      </h2>

      <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Tem certeza que deseja recusar esse pedido de reivindicação?
      </p>

      <div className="flex flex-col gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button
          onClick={handleReject}
          className="
            bg-red-200 text-red-800
            hover:bg-red-300
            dark:bg-red-900 dark:text-red-100
            dark:hover:bg-red-800
          "
        >
          Rejeitar pedido
        </Button>
      </div>
    </Modal>
  );
}
