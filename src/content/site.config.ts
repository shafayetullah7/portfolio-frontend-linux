export const siteConfig = {
  brand: "lite.linux",
  footer: {
    version: "System v0.3.0 (Phase 3)",
    copyright: `© ${new Date().getFullYear()}`,
  },
  hero: {
    title: "Backend-First Engineering",
    support:
      "Designing resilient APIs, data pipelines, and infra that keep products fast under real load.",
    terminalFallback: {
      whoami: "operator — Backend-First Engineering",
      skillsJson: {
        languages: ["Go", "TypeScript", "Rust", "Python"],
        infrastructure: ["Kubernetes", "AWS", "Terraform"],
        databases: ["PostgreSQL", "Redis", "Cassandra"],
      } as Record<string, string[]>,
    },
  },
  /** Sample platform targets for the metrics strip (not live telemetry). */
  metrics: [
    { value: "99.99%", label: "UPTIME RECORD" },
    { value: "10k+", label: "REQS / SEC" },
    { value: "45ms", label: "RAW LATENCY" },
  ] as { label: string; value: string }[],
  philosophy: [] as { id: string; title: string; body: string; icon?: string }[],
  architecture: {
    principles: [] as { title: string; body: string }[],
    nodes: [] as { id: string; label: string }[],
  },
};

export function truncateBio(bio: string, max = 160): string {
  const trimmed = bio.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}
