import ACCHeader from "./__components__/__blocks__/ACCHeader";
import ACCFooter from "./__components__/__blocks__/ACCFooter";
import ACCHero from "./__components__/__blocks__/ACCHero";
import ACCBenefits from "./__components__/__blocks__/ACCBenefits";
import ACCTestimonials from "./__components__/__blocks__/ACCTestimonials";
import ACCPricing from "./__components__/__blocks__/ACCPricing";

export default function Home() {
  return (
    <>
      <ACCHeader />

      <ACCHero />

      <ACCBenefits />

      <ACCTestimonials />

      <ACCPricing />

      <ACCFooter />
    </>
  );
}
