import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ResumeTemplate from "./resume-template";
import ResumeForm from "./resume-form";

const ResumeAccordion: FC = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Resume</AccordionTrigger>
        <AccordionContent className="grid xl:grid-cols-2 grid-cols-1 gap-4 text-balance">
          <ResumeForm />
          <ResumeTemplate />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ResumeAccordion;
