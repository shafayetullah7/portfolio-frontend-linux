import Seo from "~/components/Seo";
import FeaturedDeployments from "~/components/projects/FeaturedDeployments";
import ClosingCta from "~/components/home/ClosingCta";
import ExperienceLog from "~/components/home/ExperienceLog";
import HeroSection from "~/components/hero/HeroSection";
import MetricsStrip from "~/components/home/MetricsStrip";
import SystemArchitecture from "~/components/home/SystemArchitecture";
import TechPhilosophy from "~/components/home/TechPhilosophy";
import { siteConfig, truncateBio } from "~/content/site.config";
import { useProfile } from "~/lib/profile";

export default function HomePage() {
  const profile = useProfile();
  const description = () => {
    const raw = profile.bio();
    if (raw && raw !== siteConfig.hero.support) return truncateBio(raw, 160);
    return siteConfig.hero.support;
  };

  return (
    <>
      <Seo
        title={`${profile.name()} — ${profile.headline()}`}
        description={description()}
      />
      <HeroSection />
      <FeaturedDeployments />
      <ExperienceLog />
      <MetricsStrip />
      <SystemArchitecture />
      <TechPhilosophy />
      <ClosingCta />
    </>
  );
}
