import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AgentAccordion: FC = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Agent</AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 gap-4 text-balance">
          <iframe
            width={"100%"}
            height={"800"}
            src="https://englishjobs.pl/in/warszawa"
          ></iframe>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AgentAccordion;
