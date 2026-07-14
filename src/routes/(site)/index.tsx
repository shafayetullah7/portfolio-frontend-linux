import Seo from "~/components/Seo";
import FeaturedDeployments from "~/components/projects/FeaturedDeployments";
import ClosingCta from "~/components/home/ClosingCta";
import HeroSection from "~/components/hero/HeroSection";
import MetricsStrip from "~/components/home/MetricsStrip";
import SystemArchitecture from "~/components/home/SystemArchitecture";
import TechPhilosophy from "~/components/home/TechPhilosophy";
import { siteConfig, truncateBio } from "~/content/site.config";
import { useProfile } from "~/lib/profile";
import { useSiteContent } from "~/lib/site-content";

export default function HomePage() {
  const site = useSiteContent();
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
      <MetricsStrip />
      <FeaturedDeployments />
      <SystemArchitecture />
      <TechPhilosophy />
      <ClosingCta />
    </>
  );
}
