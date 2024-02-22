import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { UploadDropzone } from '@/lib/uploadthing';

import { Button } from '../ui/button';

type Props = {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo';
  onChange: (url?: string) => void;
  value?: string;
};

function FileUpload({ apiEndpoint, onChange, value }: Props) {
  const type = value?.split('.').pop();
  if (value) {
    return (
      <div className="flex flex-col items-center justify-center">
        {type !== 'pdf' ? (
          <div className="relative size-40">
            <Image alt="uploaded image" className="object-contain" fill src={value} />
          </div>
        ) : (
          <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
            <FileIcon />
            <a
              className="ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
              href={value}
              rel="noopener_noreferrer"
              target="_blank"
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange('')} type="button" variant="ghost">
          <X className="size-4" />
          Remove Logo
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => onChange(res?.[0]?.url)}
        onUploadError={(error: Error) => {
          throw new Error(error.message);
        }}
      />
    </div>
  );
}

export default FileUpload;
