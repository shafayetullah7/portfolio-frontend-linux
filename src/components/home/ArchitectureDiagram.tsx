import { useSiteContent } from "~/lib/site-content";

export default function ArchitectureDiagram() {
  const site = useSiteContent();
  const stroke = "currentColor";
  return (
    <div class="min-w-0 overflow-x-auto border border-bf-border bg-bf-bg p-4 text-bf-accent sm:p-6">
      <svg
        viewBox="0 0 480 320"
        class="h-auto w-full min-w-[280px]"
        role="img"
        aria-label="System architecture flow diagram"
      >
        <defs>
          <pattern id="bf-arch-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M 16 0 L 0 0 0 16"
              fill="none"
              stroke="var(--color-bf-border)"
              stroke-width="0.5"
            />
          </pattern>
        </defs>
        <rect width="480" height="320" fill="url(#bf-arch-grid)" />

        {/* Clients -> LB */}
        <rect x="170" y="16" width="140" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="240"
          y="39"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("clients")}
        </text>
        <line x1="240" y1="52" x2="240" y2="72" stroke={stroke} stroke-width="1.5" />

        <rect x="170" y="72" width="140" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="240"
          y="95"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("loadBalancer")}
        </text>

        {/* Fan to services */}
        <line x1="240" y1="108" x2="240" y2="128" stroke={stroke} stroke-width="1.5" />
        <line x1="80" y1="128" x2="400" y2="128" stroke={stroke} stroke-width="1.5" />
        <line x1="80" y1="128" x2="80" y2="148" stroke={stroke} stroke-width="1.5" />
        <line x1="240" y1="128" x2="240" y2="148" stroke={stroke} stroke-width="1.5" />
        <line x1="400" y1="128" x2="400" y2="148" stroke={stroke} stroke-width="1.5" />

        <rect x="20" y="148" width="120" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="80"
          y="171"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("auth")}
        </text>

        <rect x="180" y="148" width="120" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="240"
          y="171"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("coreApi")}
        </text>

        <rect x="340" y="148" width="120" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="400"
          y="171"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("worker")}
        </text>

        {/* Services -> DBs */}
        <line x1="80" y1="184" x2="80" y2="220" stroke={stroke} stroke-width="1.5" opacity="0.5" />
        <line x1="240" y1="184" x2="160" y2="240" stroke={stroke} stroke-width="1.5" />
        <line x1="240" y1="184" x2="320" y2="240" stroke={stroke} stroke-width="1.5" />
        <line x1="400" y1="184" x2="320" y2="240" stroke={stroke} stroke-width="1.5" opacity="0.7" />

        <rect x="100" y="240" width="120" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="160"
          y="263"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("postgres")}
        </text>

        <rect x="260" y="240" width="120" height="36" fill="var(--color-bf-surface)" stroke={stroke} />
        <text
          x="320"
          y="263"
          text-anchor="middle"
          fill="var(--color-bf-text)"
          font-size="11"
          font-family="monospace"
        >
          {site.labelFor("redis")}
        </text>
      </svg>
    </div>
  );
}
