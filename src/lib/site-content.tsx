import {
  createContext,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";
import { siteConfig } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getSiteContent } from "~/lib/api/endpoints/public";
import type { SiteContentData } from "~/lib/api/types/portfolio.types";

type SiteContentResource = ReturnType<typeof useClientResource<SiteContentData>>;

interface SiteContentContextValue {
  resource: SiteContentResource;
  brand: Accessor<string>;
  footerVersion: Accessor<string>;
  metrics: Accessor<{ label: string; value: string }[]>;
  philosophy: Accessor<
    { id?: string; title: string; body: string; icon?: string | null }[]
  >;
  principles: Accessor<{ title: string; body: string }[]>;
  labelFor: (id: string) => string;
}

const SiteContentContext = createContext<SiteContentContextValue>();

export function SiteContentProvider(props: ParentProps) {
  const resource = useClientResource(() => getSiteContent());

  const data = () => resource.data();

  const brand = () => data()?.settings.brand?.trim() || siteConfig.brand;

  const footerVersion = () =>
    data()?.settings.footerVersion?.trim() || siteConfig.footer.version;

  const metrics = () => {
    const list = data()?.metrics;
    if (list?.length) {
      return [...list]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((m) => ({ label: m.label, value: m.value }));
    }
    return siteConfig.metrics;
  };

  const philosophy = () => {
    const list = data()?.philosophy;
    if (list?.length) {
      return [...list]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p) => ({
          id: p.id,
          title: p.title,
          body: p.body,
          icon: p.icon,
        }));
    }
    return siteConfig.philosophy;
  };

  const principles = () => {
    const list = data()?.architecturePrinciples;
    if (list?.length) {
      return [...list]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((p) => ({ title: p.title, body: p.body }));
    }
    return siteConfig.architecture.principles;
  };

  const labelFor = (id: string) =>
    data()?.architectureNodeLabels?.[id] ??
    siteConfig.architecture.nodes.find((n) => n.id === id)?.label ??
    id;

  const value: SiteContentContextValue = {
    resource,
    brand,
    footerVersion,
    metrics,
    philosophy,
    principles,
    labelFor,
  };

  return (
    <SiteContentContext.Provider value={value}>
      {props.children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx;
}
