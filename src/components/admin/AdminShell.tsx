import { A, useLocation } from "@solidjs/router";
import { For, type JSX } from "solid-js";
import Button from "~/components/ui/Button";
import type { AdminUser } from "~/lib/api/types/portfolio.types";
import { adminNav } from "./adminNav";

interface AdminShellProps {
  admin: AdminUser;
  onLogout: () => void;
  children: JSX.Element;
}

export default function AdminShell(props: AdminShellProps) {
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/admin"
      ? location.pathname === "/admin" || location.pathname === "/admin/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div class="bf-grid-bg flex min-h-screen flex-col md:flex-row">
      <aside class="shrink-0 border-b border-bf-border bg-bf-bg-elevated md:w-56 md:border-b-0 md:border-r">
        <div class="border-b border-bf-border px-4 py-3">
          <p class="text-caption text-bf-accent">lite.linux</p>
          <p class="text-caption text-bf-text-muted">Admin_Panel</p>
        </div>
        <nav
          aria-label="Admin"
          class="flex gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:thin] md:block md:space-y-1 md:overflow-visible md:p-3"
        >
          <For each={adminNav}>
            {(item) => (
              <A
                href={item.path}
                class={`block shrink-0 px-3 py-2.5 text-body transition-colors ${
                  isActive(item.path)
                    ? "border-b-2 border-bf-accent bg-bf-accent-dim text-bf-accent md:border-b-0 md:border-l-2"
                    : "border-b-2 border-transparent text-bf-text-muted hover:bg-bf-surface hover:text-bf-text md:border-b-0 md:border-l-2"
                }`}
              >
                <span class="block">{item.label}</span>
                <span class="hidden text-caption md:block">{item.caption}</span>
              </A>
            )}
          </For>
        </nav>
        <div class="hidden border-t border-bf-border p-3 md:block">
          <p class="mb-2 truncate text-caption text-bf-text-muted" title={props.admin.userName}>
            @{props.admin.userName}
          </p>
          <Button type="button" variant="outline" class="w-full text-caption" onClick={props.onLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-10 flex items-center justify-between border-b border-bf-border bg-bf-bg-elevated px-4 py-3 md:static md:px-6">
          <p class="truncate text-caption text-bf-text-muted">
            {props.admin.firstName} {props.admin.lastName}
          </p>
          <Button type="button" variant="ghost" class="md:hidden" onClick={props.onLogout}>
            Logout
          </Button>
        </header>
        <main class="flex-1 p-4 md:p-6">{props.children}</main>
      </div>
    </div>
  );
}
