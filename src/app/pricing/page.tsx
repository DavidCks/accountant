import ACCFooter from "../__components__/__blocks__/ACCFooter";
import ACCHeader from "../__components__/__blocks__/ACCHeader";
import ACCPricing from "../__components__/__blocks__/ACCPricing";
import ACCWhatIsAccoutant from "../__components__/__blocks__/ACCWhatIsAccoutant";
import ACCBranding from "../__components__/__blocks__/ACCBranding";

export default function Home() {
  return (
    <>
      <ACCHeader />
      <ACCPricing />
      <ACCWhatIsAccoutant />
      <div className="pt-32">
        <ACCBranding />
      </div>
      <ACCFooter />
    </>
  );
}
