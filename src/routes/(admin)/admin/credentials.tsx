import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import { adminApi } from "~/lib/api/endpoints/admin";
import type {
  CertificationEntry,
  InterestEntry,
  LanguageEntry,
} from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

type CertForm = {
  name: string;
  issuer: string;
  date: string;
  url: string;
  includeOnResume: boolean;
  sortOrder: number;
};

type LangForm = {
  name: string;
  level: string;
  includeOnResume: boolean;
  sortOrder: number;
};

type InterestForm = {
  name: string;
  includeOnResume: boolean;
  sortOrder: number;
};

export default function AdminCredentialsPage() {
  const [refresh, setRefresh] = createSignal(0);
  const [certs] = createResource(refresh, () => adminApi.listCertifications());
  const [languages] = createResource(refresh, () => adminApi.listLanguages());
  const [interests] = createResource(refresh, () => adminApi.listInterests());

  const reload = () => setRefresh((v) => v + 1);

  const [certEditing, setCertEditing] = createSignal<CertificationEntry | null>(null);
  const [certCreating, setCertCreating] = createSignal(false);
  const [certDeleteId, setCertDeleteId] = createSignal<string | null>(null);
  const [certForm, setCertForm] = createSignal<CertForm>({
    name: "",
    issuer: "",
    date: "",
    url: "",
    includeOnResume: true,
    sortOrder: 0,
  });

  const [langEditing, setLangEditing] = createSignal<LanguageEntry | null>(null);
  const [langCreating, setLangCreating] = createSignal(false);
  const [langDeleteId, setLangDeleteId] = createSignal<string | null>(null);
  const [langForm, setLangForm] = createSignal<LangForm>({
    name: "",
    level: "",
    includeOnResume: true,
    sortOrder: 0,
  });

  const [intEditing, setIntEditing] = createSignal<InterestEntry | null>(null);
  const [intCreating, setIntCreating] = createSignal(false);
  const [intDeleteId, setIntDeleteId] = createSignal<string | null>(null);
  const [intForm, setIntForm] = createSignal<InterestForm>({
    name: "",
    includeOnResume: true,
    sortOrder: 0,
  });

  const [error, setError] = createSignal("");

  const sortByOrder = <T extends { sortOrder: number }>(list: T[]) =>
    [...list].sort((a, b) => a.sortOrder - b.sortOrder);

  const moveCert = async (entry: CertificationEntry, dir: -1 | 1) => {
    const list = sortByOrder(certs() ?? []);
    const idx = list.findIndex((e) => e.id === entry.id);
    const swap = list[idx + dir];
    if (!swap) return;
    await adminApi.updateCertification(entry.id, { sortOrder: swap.sortOrder });
    await adminApi.updateCertification(swap.id, { sortOrder: entry.sortOrder });
    reload();
  };

  const moveLang = async (entry: LanguageEntry, dir: -1 | 1) => {
    const list = sortByOrder(languages() ?? []);
    const idx = list.findIndex((e) => e.id === entry.id);
    const swap = list[idx + dir];
    if (!swap) return;
    await adminApi.updateLanguage(entry.id, { sortOrder: swap.sortOrder });
    await adminApi.updateLanguage(swap.id, { sortOrder: entry.sortOrder });
    reload();
  };

  const moveInt = async (entry: InterestEntry, dir: -1 | 1) => {
    const list = sortByOrder(interests() ?? []);
    const idx = list.findIndex((e) => e.id === entry.id);
    const swap = list[idx + dir];
    if (!swap) return;
    await adminApi.updateInterest(entry.id, { sortOrder: swap.sortOrder });
    await adminApi.updateInterest(swap.id, { sortOrder: entry.sortOrder });
    reload();
  };

  const saveCert = async () => {
    const f = certForm();
    const body = {
      name: f.name,
      issuer: f.issuer,
      date: f.date || null,
      url: f.url.trim() || null,
      includeOnResume: f.includeOnResume,
      sortOrder: f.sortOrder,
    };
    setError("");
    try {
      if (certEditing()) await adminApi.updateCertification(certEditing()!.id, body);
      else await adminApi.createCertification(body);
      setCertCreating(false);
      setCertEditing(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Save failed");
    }
  };

  const saveLang = async () => {
    const f = langForm();
    setError("");
    try {
      const body = {
        name: f.name,
        level: f.level,
        includeOnResume: f.includeOnResume,
        sortOrder: f.sortOrder,
      };
      if (langEditing()) await adminApi.updateLanguage(langEditing()!.id, body);
      else await adminApi.createLanguage(body);
      setLangCreating(false);
      setLangEditing(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Save failed");
    }
  };

  const saveInt = async () => {
    const f = intForm();
    setError("");
    try {
      const body = {
        name: f.name,
        includeOnResume: f.includeOnResume,
        sortOrder: f.sortOrder,
      };
      if (intEditing()) await adminApi.updateInterest(intEditing()!.id, body);
      else await adminApi.createInterest(body);
      setIntCreating(false);
      setIntEditing(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : "Save failed");
    }
  };

  function ListRow(props: {
    label: string;
    onUp: () => void;
    onDown: () => void;
    onEdit: () => void;
    onDelete: () => void;
  }) {
    return (
      <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-center sm:justify-between">
        <span class="min-w-0 text-body text-bf-text">{props.label}</span>
        <div class="flex flex-wrap gap-2">
          <Button type="button" variant="ghost" onClick={props.onUp} aria-label="Move up">↑</Button>
          <Button type="button" variant="ghost" onClick={props.onDown} aria-label="Move down">↓</Button>
          <Button type="button" variant="outline" onClick={props.onEdit}>Edit</Button>
          <Button type="button" variant="danger" onClick={props.onDelete}>Delete</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Title>Admin — Credentials</Title>
      <h1 class="mb-2 text-heading text-bf-text">Credentials</h1>
      <p class="mb-8 text-body text-bf-text-muted">
        Certifications, languages, and interests for the site and resume PDF.
      </p>

      <Show when={error()}>
        <p class="mb-4 text-body text-bf-error">{error()}</p>
      </Show>

      <section class="mb-10 space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <h2 class="text-caption text-bf-accent">Certifications</h2>
          <Button
            type="button"
            onClick={() => {
              setCertForm({
                name: "",
                issuer: "",
                date: "",
                url: "",
                includeOnResume: true,
                sortOrder: certs()?.length ?? 0,
              });
              setCertCreating(true);
              setError("");
            }}
          >
            New certification
          </Button>
        </div>
        <For each={sortByOrder(certs() ?? [])}>
          {(c) => (
            <ListRow
              label={`${c.name} — ${c.issuer}`}
              onUp={() => moveCert(c, -1)}
              onDown={() => moveCert(c, 1)}
              onEdit={() => {
                setCertForm({
                  name: c.name,
                  issuer: c.issuer,
                  date: c.date ? c.date.slice(0, 10) : "",
                  url: c.url ?? "",
                  includeOnResume: c.includeOnResume ?? true,
                  sortOrder: c.sortOrder,
                });
                setCertEditing(c);
              }}
              onDelete={() => setCertDeleteId(c.id)}
            />
          )}
        </For>
      </section>

      <section class="mb-10 space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <h2 class="text-caption text-bf-accent">Languages</h2>
          <Button
            type="button"
            onClick={() => {
              setLangForm({
                name: "",
                level: "",
                includeOnResume: true,
                sortOrder: languages()?.length ?? 0,
              });
              setLangCreating(true);
            }}
          >
            New language
          </Button>
        </div>
        <For each={sortByOrder(languages() ?? [])}>
          {(l) => (
            <ListRow
              label={`${l.name} — ${l.level}`}
              onUp={() => moveLang(l, -1)}
              onDown={() => moveLang(l, 1)}
              onEdit={() => {
                setLangForm({
                  name: l.name,
                  level: l.level,
                  includeOnResume: l.includeOnResume ?? true,
                  sortOrder: l.sortOrder,
                });
                setLangEditing(l);
              }}
              onDelete={() => setLangDeleteId(l.id)}
            />
          )}
        </For>
      </section>

      <section class="space-y-4">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <h2 class="text-caption text-bf-accent">Interests</h2>
          <Button
            type="button"
            onClick={() => {
              setIntForm({
                name: "",
                includeOnResume: true,
                sortOrder: interests()?.length ?? 0,
              });
              setIntCreating(true);
            }}
          >
            New interest
          </Button>
        </div>
        <For each={sortByOrder(interests() ?? [])}>
          {(i) => (
            <ListRow
              label={i.name}
              onUp={() => moveInt(i, -1)}
              onDown={() => moveInt(i, 1)}
              onEdit={() => {
                setIntForm({
                  name: i.name,
                  includeOnResume: i.includeOnResume ?? true,
                  sortOrder: i.sortOrder,
                });
                setIntEditing(i);
              }}
              onDelete={() => setIntDeleteId(i.id)}
            />
          )}
        </For>
      </section>

      <Modal
        open={certCreating() || !!certEditing()}
        onClose={() => {
          setCertCreating(false);
          setCertEditing(null);
        }}
        title={certEditing() ? "Edit certification" : "New certification"}
      >
        <div class="space-y-3">
          <AdminFieldHint variant="fact" />
          <Input placeholder="Name" value={certForm().name} onInput={(e) => setCertForm((f) => ({ ...f, name: e.currentTarget.value }))} />
          <Input placeholder="Issuer" value={certForm().issuer} onInput={(e) => setCertForm((f) => ({ ...f, issuer: e.currentTarget.value }))} />
          <Input type="date" value={certForm().date} onInput={(e) => setCertForm((f) => ({ ...f, date: e.currentTarget.value }))} />
          <Input placeholder="URL (optional)" value={certForm().url} onInput={(e) => setCertForm((f) => ({ ...f, url: e.currentTarget.value }))} />
          <label class="flex items-center gap-2 text-body">
            <input type="checkbox" checked={certForm().includeOnResume} onChange={(e) => setCertForm((f) => ({ ...f, includeOnResume: e.currentTarget.checked }))} />
            Include on resume PDF
          </label>
          <Input type="number" value={certForm().sortOrder} onInput={(e) => setCertForm((f) => ({ ...f, sortOrder: Number(e.currentTarget.value) }))} />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <Button type="button" onClick={saveCert}>Save</Button>
        </div>
      </Modal>

      <Modal
        open={langCreating() || !!langEditing()}
        onClose={() => {
          setLangCreating(false);
          setLangEditing(null);
        }}
        title={langEditing() ? "Edit language" : "New language"}
      >
        <div class="space-y-3">
          <AdminFieldHint variant="fact" />
          <Input value={langForm().name} onInput={(e) => setLangForm((f) => ({ ...f, name: e.currentTarget.value }))} />
          <Input value={langForm().level} onInput={(e) => setLangForm((f) => ({ ...f, level: e.currentTarget.value }))} />
          <label class="flex items-center gap-2 text-body">
            <input type="checkbox" checked={langForm().includeOnResume} onChange={(e) => setLangForm((f) => ({ ...f, includeOnResume: e.currentTarget.checked }))} />
            Include on resume PDF
          </label>
          <Input type="number" value={langForm().sortOrder} onInput={(e) => setLangForm((f) => ({ ...f, sortOrder: Number(e.currentTarget.value) }))} />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <Button type="button" onClick={saveLang}>Save</Button>
        </div>
      </Modal>

      <Modal
        open={intCreating() || !!intEditing()}
        onClose={() => {
          setIntCreating(false);
          setIntEditing(null);
        }}
        title={intEditing() ? "Edit interest" : "New interest"}
      >
        <div class="space-y-3">
          <AdminFieldHint variant="fact" />
          <Input value={intForm().name} onInput={(e) => setIntForm((f) => ({ ...f, name: e.currentTarget.value }))} />
          <label class="flex items-center gap-2 text-body">
            <input type="checkbox" checked={intForm().includeOnResume} onChange={(e) => setIntForm((f) => ({ ...f, includeOnResume: e.currentTarget.checked }))} />
            Include on resume PDF
          </label>
          <Input type="number" value={intForm().sortOrder} onInput={(e) => setIntForm((f) => ({ ...f, sortOrder: Number(e.currentTarget.value) }))} />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <Button type="button" onClick={saveInt}>Save</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!certDeleteId()} title="Delete" message="Remove certification?" confirmLabel="Delete" onConfirm={async () => { if (certDeleteId()) { await adminApi.deleteCertification(certDeleteId()!); setCertDeleteId(null); reload(); } }} onCancel={() => setCertDeleteId(null)} />
      <ConfirmDialog open={!!langDeleteId()} title="Delete" message="Remove language?" confirmLabel="Delete" onConfirm={async () => { if (langDeleteId()) { await adminApi.deleteLanguage(langDeleteId()!); setLangDeleteId(null); reload(); } }} onCancel={() => setLangDeleteId(null)} />
      <ConfirmDialog open={!!intDeleteId()} title="Delete" message="Remove interest?" confirmLabel="Delete" onConfirm={async () => { if (intDeleteId()) { await adminApi.deleteInterest(intDeleteId()!); setIntDeleteId(null); reload(); } }} onCancel={() => setIntDeleteId(null)} />
    </>
  );
}
