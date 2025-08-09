import AgentAccordion from "@/app/__components__/agent-accordion";
import ResumeAccordion from "@/app/__components__/resume-accordion";
import { FC } from "react";

const Jobs: FC = () => {
  return (
    <div className="w-full grid px-8 py-4">
      <ResumeAccordion />
      <AgentAccordion />
    </div>
  );
};

export default Jobs;
