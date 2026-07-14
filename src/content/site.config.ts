export const siteConfig = {
  brand: "lite.linux",
  footer: {
    version: "System v1.0.0",
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
  philosophy: [
    {
      id: "clean-architecture",
      title: "Clean Architecture",
      body: "Domain rules stay independent of frameworks. Adapters bend; the core does not.",
      icon: "01",
    },
    {
      id: "idempotency",
      title: "Idempotency",
      body: "Retries are expected. Design writes so doing them twice does not corrupt state.",
      icon: "λ",
    },
    {
      id: "performance-first",
      title: "Performance First",
      body: "Measure p99 early. Optimize the hot path before painting dashboards.",
      icon: "ms",
    },
    {
      id: "observability",
      title: "Observability",
      body: "Logs, metrics, and traces tell you why — not just that something broke.",
      icon: "02",
    },
    {
      id: "failure-domains",
      title: "Failure Domains",
      body: "Isolate blast radius. One bad dependency should not take down the fleet.",
      icon: "∴",
    },
    {
      id: "owner-operated",
      title: "Owner Operated",
      body: "You built it; you run it. Runbooks and alerts beat heroics at 3am.",
      icon: "03",
    },
  ] as { id: string; title: string; body: string; icon?: string }[],
  architecture: {
    principles: [
      {
        title: "Microservice Patterns",
        body: "Bounded contexts and clear contracts keep teams shipping without stepping on each other.",
      },
      {
        title: "Polyglot Persistence",
        body: "Pick the store for the access pattern — not the fashion of the week.",
      },
      {
        title: "Zero Trust Security",
        body: "Verify every hop. Least privilege by default; secrets never in plaintext configs.",
      },
    ] as { title: string; body: string }[],
    nodes: [
      { id: "clients", label: "Client Apps" },
      { id: "loadBalancer", label: "Load Balancer" },
      { id: "auth", label: "Auth Svc" },
      { id: "coreApi", label: "Core API" },
      { id: "worker", label: "Worker" },
      { id: "postgres", label: "PostgreSQL" },
      { id: "redis", label: "Redis" },
    ] as { id: string; label: string }[],
  },
};

export function truncateBio(bio: string, max = 160): string {
  const trimmed = bio.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function platformLabel(platform: string) {
  const known: Record<string, string> = {
    GITHUB: "GitHub",
    LINKEDIN: "LinkedIn",
    TWITTER: "Twitter",
    X: "X",
    EMAIL: "Email",
  };
  return known[platform.toUpperCase()] ?? platform;
}
