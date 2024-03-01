'use client';

import React from 'react';

import { useModal } from '@/providers/modal-provider';

import UploadMediaForm from '../forms/upload-media';
import CustomModal from '../global/custom-modal';
import { Button } from '../ui/button';

type Props = {
  subaccountId: string;
};

const MediaUploadButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal subheading="Upload a file to your media bucket" title="Upload Media">
            <UploadMediaForm subaccountId={subaccountId} />
          </CustomModal>,
        );
      }}
    >
      Upload
    </Button>
  );
};

export default MediaUploadButton;
