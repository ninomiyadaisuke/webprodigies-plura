'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Funnel } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { saveActivityLogsNotification, upsertFunnel } from '@/lib/queries';
import { useModal } from '@/providers/modal-provider';

import FileUpload from '../global/file-upload';
import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from '../ui/use-toast';
type Props = {
  defaultData?: Funnel;
  subAccountId: string;
};

const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

export type CreateFunnelFormType = z.infer<typeof CreateFunnelFormSchema>;

const FunnelForm = ({ defaultData, subAccountId }: Props) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<CreateFunnelFormType>({
    mode: 'onChange',
    resolver: zodResolver(CreateFunnelFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
      description: defaultData?.description || '',
      favicon: defaultData?.favicon || '',
      subDomainName: defaultData?.subDomainName || '',
    },
  });
  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData?.name || '',
        description: defaultData?.description || '',
        favicon: defaultData?.favicon || '',
        subDomainName: defaultData?.subDomainName || '',
      });
    }
  }, [defaultData, form]);

  const isLoading = form.formState.isLoading;
  const onSubmit = async (values: CreateFunnelFormType) => {
    if (!subAccountId) return;
    const response = await upsertFunnel(
      subAccountId,
      { ...values, liveProducts: defaultData?.liveProducts || '[]' },
      defaultData?.id || v4(),
    );
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel | ${response.name}`,
      subaccountId: subAccountId,
    });

    if (response)
      toast({
        title: 'Success',
        description: 'Saved funnel details',
      });
    else
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save funnel details',
      });
    setClose();
    router.refresh();
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
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
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us a little bit more about this funnel." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input placeholder="Sub domain for funnel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint="subaccountLogo" onChange={field.onChange} value={field.value} />
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

export default FunnelForm;
