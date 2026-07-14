import { JSX, Show, createEffect, onCleanup } from "solid-js";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
}

export default function Modal(props: ModalProps) {
  let panelRef: HTMLDivElement | undefined;
  let previousFocus: HTMLElement | null = null;

  createEffect(() => {
    if (!props.open) return;

    previousFocus = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        props.onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef) return;
      const focusable = panelRef.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    queueMicrotask(() => {
      const first = panelRef?.querySelector<HTMLElement>("button, input, select, textarea");
      first?.focus();
    });

    onCleanup(() => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    });
  });

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70" onClick={props.onClose} />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          class="relative z-10 w-full max-w-lg border border-bf-border bg-bf-surface p-6"
        >
          <h2 id="modal-title" class="mb-4 text-heading text-bf-text">
            {props.title}
          </h2>
          {props.children}
        </div>
      </div>
    </Show>
  );
}
