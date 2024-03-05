'use client';

import { Pipeline } from '@prisma/client';
// import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import CreatePipelineForm from '@/components/forms/create-pipeline-form';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { useModal } from '@/providers/modal-provider';

type Props = {
  subAccountId: string;
  pipelines: Pipeline[];
  pipelineId: string;
};

const PipelineInfoBar = ({ subAccountId, pipelines, pipelineId }: Props) => {
  const { setOpen: setOpenModal } = useModal();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pipelineId);

  const handleClickCreatePipeline = () => {
    setOpenModal(
      <CustomModal
        subheading="Pipelines allows you to group tickets into lanes and track your business processes all in one place."
        title="Create A Pipeline"
      >
        <CreatePipelineForm subAccountId={subAccountId} />
      </CustomModal>,
    );
  };
  return (
    <div>
      <div className="flex items-end gap-2">
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger asChild>
            <Button aria-expanded={open} className="w-[200px] justify-between" role="combobox" variant="outline">
              {value ? pipelines.find((pipeline) => pipeline.id === value)?.name : 'Select a pipeline...'}
              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandEmpty>No pipelines found.</CommandEmpty>
              <CommandGroup>
                {pipelines.map((pipeline) => (
                  <Link href={`/subaccount/${subAccountId}/pipelines/${pipeline.id}`} key={pipeline.id}>
                    <CommandItem
                      className="flex items-center"
                      key={pipeline.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setOpen(false);
                      }}
                      value={pipeline.id}
                    >
                      <Check className={cn('mr-2 h-4 w-4', value === pipeline.id ? 'opacity-100' : 'opacity-0')} />
                      {pipeline.name}
                    </CommandItem>
                  </Link>
                ))}
                <Button className="mt-4 flex w-full gap-2" onClick={handleClickCreatePipeline} variant="secondary">
                  <Plus size={15} />
                  Create Pipeline
                </Button>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default PipelineInfoBar;
