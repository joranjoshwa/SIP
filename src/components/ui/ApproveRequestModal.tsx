import { Button } from "./Button";
import { Modal } from "./Modal";

type ApproveRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ApproveRequestModal({
  open,
  onClose,
}: ApproveRequestModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-2 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Aprovar reivindicação
      </h2>

      <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Tem certeza que deseja aprovar esse pedido de reivindicação?
      </p>

      <div className="mb-6 flex items-center gap-3">
        <img
          src="/img/avatar.png"
          alt="Usuário"
          className="h-10 w-10 rounded-full object-cover"
        />

        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Valentina Silveira
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            25/06/25 às 09:30h
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button
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
