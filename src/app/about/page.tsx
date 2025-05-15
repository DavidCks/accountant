import ACCFooter from "../__components__/__blocks__/ACCFooter";
import ACCHeader from "../__components__/__blocks__/ACCHeader";
import ACCBranding from "../__components__/__blocks__/ACCBranding";
import ACCWhatIsAccoutant from "../__components__/__blocks__/ACCWhatIsAccoutant";
import ACCWhatIsSandai from "../__components__/__blocks__/ACCWhatIsSandai";

export default function Home() {
  return (
    <>
      <ACCHeader />
      <div className="pt-32 pb-16">
        <ACCBranding />
      </div>
      <ACCWhatIsAccoutant />
      <ACCWhatIsSandai />
      <ACCFooter />
    </>
  );
}
