'use client';

import { Agency, AgencySidebarOption, SubAccount, User } from '@prisma/client';
import { PlusCircleIcon } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import SubAccountDetails from '@/components/forms/subaccount-details';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';

import { useModal } from '@/providers/modal-provider';

type ExtendedAgency = Agency & {
  SubAccount?: SubAccount[];
  SideBarOption?: AgencySidebarOption[];
};

type Props = {
  user: User & {
    Agency: ExtendedAgency | null;
  };
  className: string;
};

const CreateSubaccountButton = ({ user, className }: Props) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;

  if (!agencyDetails) return;
  return (
    <Button
      className={twMerge('w-full flex gap-4', className)}
      onClick={() => {
        setOpen(
          <CustomModal subheading="You can switch bettween" title="Create a Subaccount">
            <SubAccountDetails agencyDetails={agencyDetails} userName={user.name} />
          </CustomModal>,
        );
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};

export default CreateSubaccountButton;
