import { A } from "@solidjs/router";
import { Container } from "~/components/ui";
import HeroTerminal, { fallbackSkillsJson, fallbackWhoami } from "~/components/hero/HeroTerminal";
import { siteConfig, truncateBio } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getProfile, getSkills } from "~/lib/api/endpoints/public";
import { groupSkillsByCategory } from "~/lib/skills-json";

export default function HeroSection() {
  const profile = useClientResource(() => getProfile());
  const skills = useClientResource(() => getSkills());

  const loading = () => profile.loading() || skills.loading();

  const title = () => {
    const headline = profile.data()?.profile?.headline?.trim();
    return headline || siteConfig.hero.title;
  };

  const support = () => {
    const bio = profile.data()?.profile?.bio?.trim();
    if (bio) return truncateBio(bio);
    return siteConfig.hero.support;
  };

  const whoamiLine = () => {
    if (profile.error() || !profile.data()?.profile) return fallbackWhoami();
    const name = profile.data()!.profile!.name.trim() || siteConfig.brand;
    const headline = profile.data()!.profile!.headline.trim();
    return headline ? `${name} — ${headline}` : name;
  };

  const skillsJson = () => {
    if (skills.error() || !skills.data()?.length) return fallbackSkillsJson();
    return groupSkillsByCategory(skills.data()!);
  };

  return (
    <section class="bf-hero-enter">
      <Container class="flex flex-col gap-8 py-16 sm:gap-10 sm:py-24">
        <div class="flex flex-col gap-4">
          <h1 class="text-display text-bf-text">
            {title()}
            <span class="bf-cursor-blink text-bf-accent" aria-hidden="true">
              _
            </span>
          </h1>
          <p class="max-w-2xl text-body text-bf-text-muted">{support()}</p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <A
            href="/contact"
            class="inline-flex h-11 items-center justify-center bg-bf-accent px-5 text-body font-semibold text-bf-bg no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            Run Diagnostics
          </A>
          <A
            href="/projects"
            class="inline-flex h-11 items-center justify-center border border-bf-accent px-5 text-body font-semibold text-bf-accent no-underline hover:bg-bf-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            Read Docs
          </A>
        </div>

        <HeroTerminal loading={loading()} whoamiLine={whoamiLine()} skillsJson={skillsJson()} />
      </Container>
    </section>
  );
}
