import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

// Define the types for the accordion items
interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionBodyProps {
  items: AccordionItem[];
}

export function AccordionBody({ items }: AccordionBodyProps) {
  return (
    <Accordion>
      {items.map((item, index) => (
        <AccordionPanel key={index}>
          <AccordionTitle>{item.title}</AccordionTitle>
          <AccordionContent>
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              {item.content}
            </p>
          </AccordionContent>
        </AccordionPanel>
      ))}
    </Accordion>
  );
}
