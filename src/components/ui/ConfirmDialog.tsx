import { Show } from "solid-js";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div
          class="w-full max-w-md border border-bf-border bg-bf-surface p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          <h2 id="confirm-dialog-title" class="mb-2 text-heading text-bf-text">
            {props.title}
          </h2>
          <p class="mb-6 text-body text-bf-text-muted">{props.message}</p>
          <div class="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" onClick={props.onCancel}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={props.onConfirm}>
              {props.confirmLabel ?? "Confirm"}
            </Button>
          </div>
        </div>
      </div>
    </Show>
  );
}
