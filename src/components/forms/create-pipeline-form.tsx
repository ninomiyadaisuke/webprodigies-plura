'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pipeline } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { saveActivityLogsNotification, upsertPipeline } from '@/lib/queries';
import { useModal } from '@/providers/modal-provider';

import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

type Props = {
  defaultData?: Pipeline;
  subAccountId: string;
};

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

type FormData = z.infer<typeof CreatePipelineFormSchema>;

const CreatePipelineForm = ({ defaultData, subAccountId }: Props) => {
  const { setClose } = useModal();
  const router = useRouter();

  const form = useForm<FormData>({
    mode: 'onChange',
    resolver: zodResolver(CreatePipelineFormSchema),
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

  const onSubmit: SubmitHandler<FormData> = async (values) => {
    if (!subAccountId) return;
    try {
      const response = await upsertPipeline({
        ...values,
        id: defaultData?.id,
        subAccountId: subAccountId,
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${response?.name}`,
        subaccountId: subAccountId,
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
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
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
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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

export default CreatePipelineForm;
