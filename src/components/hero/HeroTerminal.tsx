import { Show } from "solid-js";
import { TerminalWindow } from "~/components/ui";
import { siteConfig } from "~/content/site.config";

interface HeroTerminalProps {
  loading: boolean;
  whoamiLine: string;
  skillsJson: Record<string, string[]>;
}

export default function HeroTerminal(props: HeroTerminalProps) {
  return (
    <TerminalWindow title="operator@lite — zsh" class="w-full shadow-[0_0_0_1px_var(--color-bf-border-strong)]">
      <Show
        when={!props.loading}
        fallback={
          <div class="min-h-48 space-y-3 p-1" aria-busy="true" aria-label="Loading terminal">
            <div class="h-4 w-24 animate-pulse bg-bf-border" />
            <div class="h-4 w-3/4 max-w-md animate-pulse bg-bf-border" />
            <div class="mt-4 h-4 w-36 animate-pulse bg-bf-border" />
            <div class="h-28 w-full max-w-lg animate-pulse bg-bf-border" />
          </div>
        }
      >
        <div class="min-h-48 space-y-1">
          <p class="text-bf-text-muted">$ whoami</p>
          <p class="text-bf-text">{props.whoamiLine}</p>
          <p class="mt-5 text-bf-text-muted">$ cat skills.json</p>
          <pre class="mt-1 overflow-x-auto whitespace-pre-wrap break-words text-bf-accent">
            {JSON.stringify(props.skillsJson, null, 2)}
          </pre>
        </div>
      </Show>
    </TerminalWindow>
  );
}

export function fallbackWhoami(): string {
  return siteConfig.hero.terminalFallback.whoami;
}

export function fallbackSkillsJson(): Record<string, string[]> {
  return siteConfig.hero.terminalFallback.skillsJson;
}
