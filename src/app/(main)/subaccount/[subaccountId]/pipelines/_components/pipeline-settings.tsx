'use client';
import { Pipeline } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React from 'react';

import CreatePipelineForm from '@/components/forms/create-pipeline-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { deletePipeline } from '@/lib/queries';

type Props = {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
};

const PipelineSettings = ({ pipelineId, subaccountId, pipelines }: Props) => {
  const router = useRouter();

  const handleClickDeletePipeline = async () => {
    try {
      await deletePipeline(pipelineId);
      toast({
        title: 'Deleted',
        description: 'Pipeline is deleted',
      });

      router.replace(`/subaccount/${subaccountId}/pipelines`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could Delete Pipeline',
      });
    }
  };

  return (
    <AlertDialog>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <AlertDialogTrigger asChild>
            <Button variant={'destructive'}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClickDeletePipeline}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
        <CreatePipelineForm defaultData={pipelines.find((p) => p.id === pipelineId)} subAccountId={subaccountId} />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
