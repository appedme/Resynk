import { Testimonials } from "@/components/landing/Testimonials";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <Testimonials />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
