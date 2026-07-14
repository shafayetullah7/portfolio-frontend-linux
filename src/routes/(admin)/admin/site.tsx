import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import QueryState from "~/components/ui/QueryState";
import Textarea from "~/components/ui/Textarea";
import { siteConfig } from "~/content/site.config";
import { adminApi } from "~/lib/api/endpoints/admin";
import { ApiError } from "~/lib/api/types";
import type {
  SiteArchitecturePrinciple,
  SiteMetric,
  SitePhilosophy,
} from "~/lib/api/types/portfolio.types";

type ListKind = "metrics" | "philosophy" | "principles";

function errMsg(e: unknown) {
  return e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Request failed";
}

export default function AdminSitePage() {
  const [refresh, setRefresh] = createSignal(0);
  const [content] = createResource(refresh, () => adminApi.getSiteContent());
  const reload = () => setRefresh((v) => v + 1);

  const [brand, setBrand] = createSignal("");
  const [footerVersion, setFooterVersion] = createSignal("");
  const [nodeLabels, setNodeLabels] = createSignal<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = createSignal(false);
  const [settingsStatus, setSettingsStatus] = createSignal<{
    kind: "idle" | "success" | "error";
    message: string;
  }>({ kind: "idle", message: "" });

  createEffect(() => {
    const c = content();
    if (!c) return;
    setBrand(c.settings.brand);
    setFooterVersion(c.settings.footerVersion);
    const labels: Record<string, string> = {};
    for (const node of siteConfig.architecture.nodes) {
      labels[node.id] = c.architectureNodeLabels?.[node.id] ?? node.label;
    }
    setNodeLabels(labels);
  });

  const saveSettings = async () => {
    setSavingSettings(true);
    setSettingsStatus({ kind: "idle", message: "" });
    try {
      await adminApi.updateSiteSettings({
        brand: brand(),
        footerVersion: footerVersion(),
        architectureNodeLabels: nodeLabels(),
      });
      reload();
      setSettingsStatus({ kind: "success", message: "Settings saved." });
    } catch (e: unknown) {
      setSettingsStatus({ kind: "error", message: errMsg(e) });
    } finally {
      setSavingSettings(false);
    }
  };

  const setNodeLabel = (id: string, value: string) =>
    setNodeLabels((prev) => ({ ...prev, [id]: value }));

  // —— Shared list modal / delete ——
  const [listError, setListError] = createSignal("");
  const [modalKind, setModalKind] = createSignal<ListKind | null>(null);
  const [editingId, setEditingId] = createSignal<string | null>(null);
  const [fieldTitle, setFieldTitle] = createSignal("");
  const [fieldBody, setFieldBody] = createSignal("");
  const [fieldIcon, setFieldIcon] = createSignal("");
  const [fieldLabel, setFieldLabel] = createSignal("");
  const [fieldValue, setFieldValue] = createSignal("");
  const [fieldSort, setFieldSort] = createSignal(0);
  const [deleteTarget, setDeleteTarget] = createSignal<{
    kind: ListKind;
    id: string;
  } | null>(null);

  const closeModal = () => {
    setModalKind(null);
    setEditingId(null);
    setListError("");
  };

  const openCreate = (kind: ListKind) => {
    setEditingId(null);
    setFieldTitle("");
    setFieldBody("");
    setFieldIcon("");
    setFieldLabel("");
    setFieldValue("");
    const len =
      kind === "metrics"
        ? content()?.metrics.length ?? 0
        : kind === "philosophy"
          ? content()?.philosophy.length ?? 0
          : content()?.architecturePrinciples.length ?? 0;
    setFieldSort(len);
    setListError("");
    setModalKind(kind);
  };

  const openEditMetric = (m: SiteMetric) => {
    setEditingId(m.id);
    setFieldLabel(m.label);
    setFieldValue(m.value);
    setFieldSort(m.sortOrder);
    setListError("");
    setModalKind("metrics");
  };

  const openEditPhilosophy = (p: SitePhilosophy) => {
    setEditingId(p.id);
    setFieldTitle(p.title);
    setFieldBody(p.body);
    setFieldIcon(p.icon ?? "");
    setFieldSort(p.sortOrder);
    setListError("");
    setModalKind("philosophy");
  };

  const openEditPrinciple = (p: SiteArchitecturePrinciple) => {
    setEditingId(p.id);
    setFieldTitle(p.title);
    setFieldBody(p.body);
    setFieldSort(p.sortOrder);
    setListError("");
    setModalKind("principles");
  };

  const saveListItem = async () => {
    const kind = modalKind();
    if (!kind) return;
    setListError("");
    try {
      if (kind === "metrics") {
        const body = {
          label: fieldLabel(),
          value: fieldValue(),
          sortOrder: fieldSort(),
        };
        if (editingId()) await adminApi.updateSiteMetric(editingId()!, body);
        else await adminApi.createSiteMetric(body);
      } else if (kind === "philosophy") {
        const body = {
          title: fieldTitle(),
          body: fieldBody(),
          icon: fieldIcon() || null,
          sortOrder: fieldSort(),
        };
        if (editingId()) await adminApi.updateSitePhilosophy(editingId()!, body);
        else await adminApi.createSitePhilosophy(body);
      } else {
        const body = {
          title: fieldTitle(),
          body: fieldBody(),
          sortOrder: fieldSort(),
        };
        if (editingId()) {
          await adminApi.updateSiteArchitecturePrinciple(editingId()!, body);
        } else {
          await adminApi.createSiteArchitecturePrinciple(body);
        }
      }
      closeModal();
      reload();
    } catch (e: unknown) {
      setListError(errMsg(e));
    }
  };

  const moveMetric = async (item: SiteMetric, dir: -1 | 1) => {
    const list = [...(content()?.metrics ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((s) => s.id === item.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setListError("");
    try {
      await adminApi.updateSiteMetric(item.id, { sortOrder: swap.sortOrder });
      await adminApi.updateSiteMetric(swap.id, { sortOrder: item.sortOrder });
      reload();
    } catch (e: unknown) {
      setListError(errMsg(e));
    }
  };

  const movePhilosophy = async (item: SitePhilosophy, dir: -1 | 1) => {
    const list = [...(content()?.philosophy ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((s) => s.id === item.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setListError("");
    try {
      await adminApi.updateSitePhilosophy(item.id, { sortOrder: swap.sortOrder });
      await adminApi.updateSitePhilosophy(swap.id, { sortOrder: item.sortOrder });
      reload();
    } catch (e: unknown) {
      setListError(errMsg(e));
    }
  };

  const movePrinciple = async (item: SiteArchitecturePrinciple, dir: -1 | 1) => {
    const list = [...(content()?.architecturePrinciples ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    const idx = list.findIndex((s) => s.id === item.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setListError("");
    try {
      await adminApi.updateSiteArchitecturePrinciple(item.id, {
        sortOrder: swap.sortOrder,
      });
      await adminApi.updateSiteArchitecturePrinciple(swap.id, {
        sortOrder: item.sortOrder,
      });
      reload();
    } catch (e: unknown) {
      setListError(errMsg(e));
    }
  };

  const remove = async () => {
    const target = deleteTarget();
    if (!target) return;
    setListError("");
    try {
      if (target.kind === "metrics") await adminApi.deleteSiteMetric(target.id);
      else if (target.kind === "philosophy") await adminApi.deleteSitePhilosophy(target.id);
      else await adminApi.deleteSiteArchitecturePrinciple(target.id);
      setDeleteTarget(null);
      reload();
    } catch (e: unknown) {
      setListError(errMsg(e));
    }
  };

  const modalTitle = () => {
    const kind = modalKind();
    const edit = !!editingId();
    if (kind === "metrics") return edit ? "Edit metric" : "Create metric";
    if (kind === "philosophy") return edit ? "Edit philosophy" : "Create philosophy";
    if (kind === "principles") return edit ? "Edit principle" : "Create principle";
    return "";
  };

  return (
    <>
      <Title>Admin — Site</Title>
      <h1 class="mb-2 text-heading text-bf-text">Site</h1>
      <p class="mb-6 text-body text-bf-text-muted">
        Marketing content for the public home page — brand, metrics, philosophy, and architecture.
      </p>

      <Show when={listError() && !modalKind()}>
        {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <QueryState
        loading={content.loading}
        error={content.error}
        loadingMessage="Loading site content..."
      >
        <div class="space-y-10">
          {/* Settings */}
          <section class="max-w-xl space-y-4">
            <h2 class="text-heading text-bf-text">Settings</h2>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="site-brand">
                Brand
              </label>
              <Input
                id="site-brand"
                value={brand()}
                onInput={(e) => setBrand(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="site-version">
                Footer version
              </label>
              <Input
                id="site-version"
                value={footerVersion()}
                onInput={(e) => setFooterVersion(e.currentTarget.value)}
              />
            </div>

            <h3 class="pt-2 text-body font-semibold text-bf-text">Architecture node labels</h3>
            <p class="text-caption text-bf-text-muted">
              Diagram layout is fixed in code; edit labels only.
            </p>
            <For each={siteConfig.architecture.nodes}>
              {(node) => (
                <div>
                  <label
                    class="mb-1 block text-caption text-bf-text-muted"
                    for={`node-${node.id}`}
                  >
                    {node.id}
                  </label>
                  <Input
                    id={`node-${node.id}`}
                    value={nodeLabels()[node.id] ?? ""}
                    onInput={(e) => setNodeLabel(node.id, e.currentTarget.value)}
                  />
                </div>
              )}
            </For>

            <div class="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={saveSettings} disabled={savingSettings()}>
                {savingSettings() ? "Saving…" : "Save settings"}
              </Button>
              <Show when={settingsStatus().kind !== "idle"}>
                <p
                  class={`text-body ${
                    settingsStatus().kind === "error" ? "text-bf-error" : "text-bf-accent"
                  }`}
                >
                  {settingsStatus().message}
                </p>
              </Show>
            </div>
          </section>

          {/* Metrics */}
          <section>
            <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 class="text-heading text-bf-text">Metrics</h2>
                <p class="text-caption text-bf-text-muted">Marketing strip values (not live telemetry).</p>
              </div>
              <Button type="button" onClick={() => openCreate("metrics")}>
                New metric
              </Button>
            </div>
            <div class="space-y-2">
              <For
                each={[...(content()?.metrics ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)}
              >
                {(m) => (
                  <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span class="min-w-0 text-body text-bf-text">
                      {m.value} — {m.label}
                    </span>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => moveMetric(m, -1)}
                        aria-label="Move up"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => moveMetric(m, 1)}
                        aria-label="Move down"
                      >
                        ↓
                      </Button>
                      <Button type="button" variant="outline" onClick={() => openEditMetric(m)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => setDeleteTarget({ kind: "metrics", id: m.id })}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>

          {/* Philosophy */}
          <section>
            <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 class="text-heading text-bf-text">Philosophy</h2>
                <p class="text-caption text-bf-text-muted">Tech philosophy cards on the home page.</p>
              </div>
              <Button type="button" onClick={() => openCreate("philosophy")}>
                New item
              </Button>
            </div>
            <div class="space-y-2">
              <For
                each={[...(content()?.philosophy ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)}
              >
                {(p) => (
                  <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span class="min-w-0 text-body text-bf-text">
                      [{p.icon ?? "•"}] {p.title}
                    </span>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => movePhilosophy(p, -1)}
                        aria-label="Move up"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => movePhilosophy(p, 1)}
                        aria-label="Move down"
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openEditPhilosophy(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => setDeleteTarget({ kind: "philosophy", id: p.id })}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>

          {/* Architecture principles */}
          <section>
            <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 class="text-heading text-bf-text">Architecture principles</h2>
                <p class="text-caption text-bf-text-muted">
                  Principle list beside the fixed diagram.
                </p>
              </div>
              <Button type="button" onClick={() => openCreate("principles")}>
                New principle
              </Button>
            </div>
            <div class="space-y-2">
              <For
                each={[...(content()?.architecturePrinciples ?? [])].sort(
                  (a, b) => a.sortOrder - b.sortOrder,
                )}
              >
                {(p) => (
                  <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-center sm:justify-between">
                    <span class="min-w-0 text-body text-bf-text">{p.title}</span>
                    <div class="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => movePrinciple(p, -1)}
                        aria-label="Move up"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => movePrinciple(p, 1)}
                        aria-label="Move down"
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openEditPrinciple(p)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => setDeleteTarget({ kind: "principles", id: p.id })}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>
        </div>
      </QueryState>

      <Modal open={!!modalKind()} onClose={closeModal} title={modalTitle()}>
        <div class="space-y-3">
          <Show when={modalKind() === "metrics"}>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="metric-value">
                Value
              </label>
              <Input
                id="metric-value"
                value={fieldValue()}
                onInput={(e) => setFieldValue(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="metric-label">
                Label
              </label>
              <Input
                id="metric-label"
                value={fieldLabel()}
                onInput={(e) => setFieldLabel(e.currentTarget.value)}
              />
            </div>
          </Show>
          <Show when={modalKind() === "philosophy" || modalKind() === "principles"}>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="item-title">
                Title
              </label>
              <Input
                id="item-title"
                value={fieldTitle()}
                onInput={(e) => setFieldTitle(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="item-body">
                Body
              </label>
              <Textarea
                id="item-body"
                rows={4}
                value={fieldBody()}
                onInput={(e) => setFieldBody(e.currentTarget.value)}
              />
            </div>
          </Show>
          <Show when={modalKind() === "philosophy"}>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="item-icon">
                Icon
              </label>
              <Input
                id="item-icon"
                value={fieldIcon()}
                onInput={(e) => setFieldIcon(e.currentTarget.value)}
              />
            </div>
          </Show>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="item-sort">
              Sort order
            </label>
            <Input
              id="item-sort"
              type="number"
              value={fieldSort()}
              onInput={(e) => setFieldSort(Number(e.currentTarget.value))}
            />
          </div>
          <Show when={listError()}>
            {(msg) => <p class="text-body text-bf-error">{msg()}</p>}
          </Show>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="button" onClick={saveListItem}>
            Save
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget()}
        title="Delete item"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
