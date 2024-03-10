import * as React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/ui/data-display';

export const Details = ({
  summary,
  children,
  className,
}: {
  summary: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Accordion type='single' collapsible className={className}>
    <AccordionItem value={summary} className='rounded-md border [&>h3]:m-0'>
      <AccordionTrigger className='hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground px-4 hover:no-underline [&>p]:m-0'>
        {summary}
      </AccordionTrigger>
      <AccordionContent className='[&>div]:pb-0'>
        <div className='p-4 first:[&>*]:mt-0 last:[&>*]:mb-0'>{children}</div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
