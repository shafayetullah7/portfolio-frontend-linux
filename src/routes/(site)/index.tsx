import Seo from "~/components/Seo";
import FeaturedDeployments from "~/components/projects/FeaturedDeployments";
import ClosingCta from "~/components/home/ClosingCta";
import HeroSection from "~/components/hero/HeroSection";
import MetricsStrip from "~/components/home/MetricsStrip";
import SystemArchitecture from "~/components/home/SystemArchitecture";
import TechPhilosophy from "~/components/home/TechPhilosophy";
import { siteConfig, truncateBio } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getProfile } from "~/lib/api/endpoints/public";

export default function HomePage() {
  const profile = useClientResource(() => getProfile());
  const description = () => {
    const bio = profile.data()?.profile?.bio?.trim();
    if (bio) return truncateBio(bio, 160);
    return siteConfig.hero.support;
  };

  return (
    <>
      <Seo
        title={`${siteConfig.brand} — ${siteConfig.hero.title}`}
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
