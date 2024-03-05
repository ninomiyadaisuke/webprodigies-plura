'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lane } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getPipelineDetails, saveActivityLogsNotification, upsertLane } from '@/lib/queries';
import { LaneFormSchema } from '@/lib/types';
import { useModal } from '@/providers/modal-provider';

import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

type Props = {
  defaultData?: Lane;
  pipelineId: string;
};

type FormDataType = z.infer<typeof LaneFormSchema>;

const LaneForm = ({ defaultData, pipelineId }: Props) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<FormDataType>({
    mode: 'onChange',
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || '',
      });
    }
  }, [defaultData, form]);

  const isLoading = form.formState.isLoading;

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
    if (!pipelineId) return;
    try {
      const response = await upsertLane({
        ...values,
        pipelineId,
        id: defaultData?.id,
        order: defaultData?.order,
      });
      const d = await getPipelineDetails(pipelineId);
      if (!d) return;

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a lane | ${response?.name}`,
        subaccountId: d.subAccountId,
      });
      toast({
        title: 'Success',
        description: 'Saved pipeline details',
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save pipeline details',
      });
    }
    setClose();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={isLoading}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lane Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lane Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4 w-20" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneForm;
