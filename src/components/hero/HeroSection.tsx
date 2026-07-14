import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import HeroTerminal, { fallbackWhoami } from "~/components/hero/HeroTerminal";
import { Container, Tag } from "~/components/ui";
import { siteConfig, truncateBio } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getSkills } from "~/lib/api/endpoints/public";
import { useProfile } from "~/lib/profile";
import { groupSkillsByCategory } from "~/lib/skills-json";

export default function HeroSection() {
  const profile = useProfile();
  const skills = useClientResource(() => getSkills());

  const whoamiLine = () => {
    if (profile.resource.error() || !profile.resource.data()?.profile) {
      return fallbackWhoami();
    }
    const headline = profile.headline();
    return headline ? `${profile.name()} — ${headline}` : profile.name();
  };

  const skillsByCategory = () => {
    if (skills.error() || !skills.data()?.length) {
      return siteConfig.hero.terminalFallback.skillsJson;
    }
    return groupSkillsByCategory(skills.data()!);
  };

  const skillCategories = () => Object.entries(skillsByCategory());

  const bioDisplay = () => {
    const raw = profile.bio();
    if (raw === siteConfig.hero.support) return raw;
    return truncateBio(raw, 240);
  };

  return (
    <section class="bf-hero-enter border-b border-bf-border">
      <Container class="flex flex-col gap-8 py-20 sm:gap-10 sm:py-28">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Show when={profile.avatarUrl()}>
            {(url) => (
              <img
                src={url()}
                alt={profile.name()}
                class="h-24 w-24 shrink-0 border border-bf-border object-cover sm:h-28 sm:w-28"
              />
            )}
          </Show>
          <div class="flex min-w-0 flex-col gap-3">
            <h1 class="text-display break-words text-bf-text">
              {profile.name()}
              <span class="bf-cursor-blink text-bf-accent" aria-hidden="true">
                _
              </span>
            </h1>
            <p class="text-body text-bf-text-muted">{profile.headline()}</p>
            <p class="max-w-2xl text-body text-bf-text-muted">{bioDisplay()}</p>
          </div>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <A
            href="/contact"
            class="inline-flex h-11 items-center justify-center bg-bf-accent px-6 text-body font-semibold text-bf-bg no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            Contact.Me()
          </A>
          <A
            href="/projects"
            class="inline-flex h-11 items-center justify-center border border-bf-accent px-6 text-body font-semibold text-bf-accent no-underline hover:bg-bf-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            ./projects
          </A>
        </div>

        <Show when={!skills.loading() && skillCategories().length > 0}>
          <div class="flex flex-col gap-4" aria-label="Skills">
            <For each={skillCategories()}>
              {([category, names]) => (
                <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
                  <span class="shrink-0 text-caption uppercase tracking-wider text-bf-text-muted">
                    {category}
                  </span>
                  <div class="flex flex-wrap gap-2">
                    <For each={names}>{(name) => <Tag>{name}</Tag>}</For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <HeroTerminal loading={profile.resource.loading()} whoamiLine={whoamiLine()} />
      </Container>
    </section>
  );
}
