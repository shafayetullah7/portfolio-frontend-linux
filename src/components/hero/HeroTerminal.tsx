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
    <TerminalWindow title="~/shell" class="w-full">
      <Show
        when={!props.loading}
        fallback={
          <div class="space-y-3" aria-busy="true" aria-label="Loading terminal">
            <div class="h-4 w-24 animate-pulse bg-bf-border" />
            <div class="h-4 w-3/4 max-w-md animate-pulse bg-bf-border" />
            <div class="mt-4 h-4 w-36 animate-pulse bg-bf-border" />
            <div class="h-20 w-full max-w-lg animate-pulse bg-bf-border" />
          </div>
        }
      >
        <p class="text-bf-text-muted">$ whoami</p>
        <p class="mt-1 text-bf-text">{props.whoamiLine}</p>
        <p class="mt-4 text-bf-text-muted">$ cat skills.json</p>
        <pre class="mt-1 overflow-x-auto whitespace-pre-wrap break-words text-bf-accent">
          {JSON.stringify(props.skillsJson, null, 2)}
        </pre>
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
