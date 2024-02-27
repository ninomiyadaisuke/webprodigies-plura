import { DialogDescription } from '@radix-ui/react-dialog';
import React from 'react';

import { useModal } from '@/providers/modal-provider';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomModal = ({ title, subheading, children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog onOpenChange={setClose} open={isOpen || defaultOpen}>
      <DialogContent className="h-screen overflow-scroll bg-card md:h-fit md:max-h-[700px]">
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
