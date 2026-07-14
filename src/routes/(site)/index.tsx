import FeaturedDeployments from "~/components/projects/FeaturedDeployments";
import HeroSection from "~/components/hero/HeroSection";
import MetricsStrip from "~/components/home/MetricsStrip";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MetricsStrip />
      <FeaturedDeployments />
    </>
  );
}
