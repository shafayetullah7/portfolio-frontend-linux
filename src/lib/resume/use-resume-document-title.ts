import { createEffect, onCleanup } from "solid-js";
import { formatResumeDocumentTitle } from "./resume-document-title";

/** Sync `document.title` for save-as-PDF; restores on leave (client only). */
export function useResumeDocumentTitle(fullName: () => string | undefined) {
  if (typeof document === "undefined") return;

  let previousTitle: string | undefined;

  createEffect(() => {
    const name = fullName()?.trim();
    if (!name) return;

    if (previousTitle === undefined) {
      previousTitle = document.title;
    }
    document.title = formatResumeDocumentTitle(name);
  });

  onCleanup(() => {
    if (previousTitle !== undefined) {
      document.title = previousTitle;
    }
  });
}
