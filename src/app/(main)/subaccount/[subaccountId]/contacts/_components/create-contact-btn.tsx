'use client';
import React from 'react';

import ContactUserForm from '@/components/forms/contact-user-form';
// import ContactUserForm from '@/components/forms/contact-user-form'
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';

import { useModal } from '@/providers/modal-provider';

type Props = {
  subaccountId: string;
};

const CraeteContactButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = () => {
    setOpen(
      <CustomModal subheading="Contacts are like customers." title="Create Or Update Contact information">
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>,
    );
  };
  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};

export default CraeteContactButton;
