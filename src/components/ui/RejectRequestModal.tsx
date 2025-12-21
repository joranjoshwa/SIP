import { Button } from "./Button";
import { Modal } from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function RejectRequestModal({
  open,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="mb-2 text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Rejeitar reivindicação
      </h2>

      <p className="mb-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Tem certeza que deseja recusar esse pedido de reivindicação?
      </p>

      <div className="mb-4 flex items-center gap-3">
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

      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Motivo da rejeição
      </label>

      <textarea
        rows={4}
        placeholder="Por favor especifique aqui o motivo de estar rejeitando esse pedido..."
        className="
          mb-6 w-full rounded-xl
          bg-zinc-100 dark:bg-zinc-800
          p-3 text-sm
          text-zinc-900 dark:text-zinc-100
          placeholder:text-zinc-400
          focus:outline-none
        "
      />

      <div className="flex flex-col gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button
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
