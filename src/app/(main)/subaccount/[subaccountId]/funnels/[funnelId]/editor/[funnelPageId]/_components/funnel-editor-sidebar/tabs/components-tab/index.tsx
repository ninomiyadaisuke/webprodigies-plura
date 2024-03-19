import React, { ReactNode } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { EditorBtns } from '@/lib/constants';

import CheckoutPlaceholder from './checkout-placeholder';
import ContactFormComponentPlaceholder from './contact-form-placeholder';
import ContainerPlaceholder from './container-placeholder';
import LinkPlaceholder from './link-placeholder';
import TextPlaceholder from './text-placeholder';
import TwoColumnsPlaceholder from './two-columns-placeholder';
import VideoPlaceholder from './video-placeholder';

const ComponentsTab = () => {
  const elements: {
    Component: ReactNode;
    label: string;
    id: EditorBtns;
    group: 'layout' | 'elements';
  }[] = [
    {
      Component: <TextPlaceholder />,
      label: 'Text',
      id: 'text',
      group: 'elements',
    },
    {
      Component: <ContainerPlaceholder />,
      label: 'Container',
      id: 'container',
      group: 'layout',
    },
    {
      Component: <TwoColumnsPlaceholder />,
      label: '2 Columns',
      id: '2Col',
      group: 'layout',
    },
    {
      Component: <VideoPlaceholder />,
      label: 'Video',
      id: 'video',
      group: 'elements',
    },
    {
      Component: <ContactFormComponentPlaceholder />,
      label: 'Contact',
      id: 'contactForm',
      group: 'elements',
    },
    {
      Component: <CheckoutPlaceholder />,
      label: 'Checkout',
      id: 'paymentForm',
      group: 'elements',
    },
    {
      Component: <LinkPlaceholder />,
      label: 'Link',
      id: 'link',
      group: 'elements',
    },
  ];
  console.log(elements);

  return (
    <Accordion className="w-full" defaultValue={['Layout', 'Elements']} type="multiple">
      <AccordionItem className="border-y-[1px] px-6 py-0" value="Layout">
        <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === 'layout')
            .map((element) => (
              <div className="flex flex-col items-center justify-center" key={element.id}>
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="px-6 py-0 " value="Elements">
        <AccordionTrigger className="!no-underline">Elements</AccordionTrigger>
        <AccordionContent className="flex flex-wrap gap-2 ">
          {elements
            .filter((element) => element.group === 'elements')
            .map((element) => (
              <div className="flex flex-col items-center justify-center" key={element.id}>
                {element.Component}
                <span className="text-muted-foreground">{element.label}</span>
              </div>
            ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ComponentsTab;
