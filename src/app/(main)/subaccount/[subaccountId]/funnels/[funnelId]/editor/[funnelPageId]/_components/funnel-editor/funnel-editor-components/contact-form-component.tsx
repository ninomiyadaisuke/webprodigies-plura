'use client';
import clsx from 'clsx';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { DragEvent, MouseEvent } from 'react';
import { z } from 'zod';

import ContactForm from '@/components/forms/contact-form';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

import { EditorBtns } from '@/lib/constants';
import { getFunnel, saveActivityLogsNotification, upsertContact } from '@/lib/queries';
import { EditorElement, useEditor } from '@/providers/editor/editor-provider';

type Props = {
  element: EditorElement;
};

export const ContactUserFormSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
});

export type FormDataType = z.infer<typeof ContactUserFormSchema>;

const ContactFormComponent = ({ element }: Props) => {
  const { dispatch, state, subaccountId, funnelId, pageDetails } = useEditor();
  const router = useRouter();

  const handleDragStart = (e: DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };

  const handleOnClickBody = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    });
  };

  const styles = element.styles;

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return;
    const funnelPages = await getFunnel(funnelId);
    if (!funnelPages || !pageDetails) return;
    const nextPage = funnelPages.FunnelPages.find((page) => page.order === pageDetails.order + 1);
    if (!nextPage) return;
    router.replace(
      `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`,
    );
  };

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    });
  };

  const onSubmit = async (values: FormDataType) => {
    if (!state.editor.liveMode) return;
    try {
      const response = await upsertContact({
        ...values,
        subAccountId: subaccountId,
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `A New contact signed up | ${response?.name}`,
        subaccountId: subaccountId,
      });
      toast({
        title: 'Success',
        description: 'Successfully Saved your info',
      });
      await goToNextPage();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not save your information',
      });
    }
  };

  return (
    <div
      className={clsx('relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all', {
        '!border-blue-500': state.editor.selectedElement.id === element.id,

        '!border-solid': state.editor.selectedElement.id === element.id,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      draggable
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, 'contactForm')}
      style={styles}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className="absolute left-[-1px] top-[-23px] rounded-none rounded-t-lg">
          {state.editor.selectedElement.name}
        </Badge>
      )}
      <ContactForm apiCall={onSubmit} subTitle="Contact Us" title="Want a free quote? We can help you" />
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute right-[-1px] top-[-25px] rounded-none rounded-t-lg bg-primary px-2.5 py-1 text-xs font-bold !text-white">
          <Trash className="cursor-pointer" onClick={handleDeleteElement} size={16} />
        </div>
      )}
    </div>
  );
};

export default ContactFormComponent;
