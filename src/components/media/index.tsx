import { FolderSearch } from 'lucide-react';
import React from 'react';

import { GetMediaFiles } from '@/lib/types';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';

import MediaCard from './media-card';
import MediaUploadButton from './upload-button';

type Props = {
  data: GetMediaFiles;
  subaccountId: string;
};

const MediaComponent = ({ data, subaccountId }: Props) => {
  return (
    <div className="flex size-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton subaccountId={subaccountId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="max-h-full pb-40">
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading="Media Files">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((file) => (
                <CommandItem
                  className="w-full max-w-[300px] rounded-lg !bg-transparent p-0 !font-medium !text-white"
                  key={file.id}
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex w-full items-center justify-center">
                  <FolderSearch className="text-slate-300 dark:text-muted" size={200} />
                  <p className="text-muted-foreground ">Empty! no files to show.</p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
