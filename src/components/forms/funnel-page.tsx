import { zodResolver } from '@hookform/resolvers/zod';
import { FunnelPage } from '@prisma/client';
import { CopyPlusIcon, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';

import { deleteFunnelPage, getFunnels, saveActivityLogsNotification, upsertFunnelPage } from '@/lib/queries';
import { useModal } from '@/providers/modal-provider';

import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

type Props = {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subaccountId: string;
};

export const FunnelPageSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
});

type FormDataType = z.infer<typeof FunnelPageSchema>;

const CreateFunnelPage = ({ defaultData, funnelId, order, subaccountId }: Props) => {
  const router = useRouter();
  const { setClose } = useModal();
  const form = useForm<FormDataType>({
    resolver: zodResolver(FunnelPageSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      pathName: '',
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({ name: defaultData.name, pathName: defaultData.pathName });
    }
  }, [defaultData, form]);

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
    if (order !== 0 && !values.pathName) {
      return form.setError('pathName', {
        message: "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      });
    }

    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || '',
        },
        funnelId,
      );
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subaccountId: subaccountId,
      });

      toast({
        title: 'Success',
        description: 'Saves Funnel Page Details',
      });
      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could Save Funnel Page Details',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You can move them around to change their
          order.
        </CardDescription>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                disabled={form.formState.isSubmitting}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={form.formState.isSubmitting || order === 0}
                name="pathName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Path Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Path for the page" {...field} value={field.value?.toLowerCase()} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Button className="w-24 self-end" disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? <Loading /> : 'Save Page'}
                </Button>
                {defaultData?.id && (
                  <Button
                    className="w-24 self-end border-destructive text-destructive hover:bg-destructive"
                    disabled={form.formState.isSubmitting}
                    onClick={async () => {
                      const response = await deleteFunnelPage(defaultData.id);

                      await saveActivityLogsNotification({
                        agencyId: undefined,
                        description: `Deleted a funnel page | ${response?.name}`,
                        subaccountId: subaccountId,
                      });
                      router.refresh();
                    }}
                    type="button"
                    variant={'outline'}
                  >
                    {form.formState.isSubmitting ? <Loading /> : <Trash />}
                  </Button>
                )}
                {defaultData?.id && (
                  <Button
                    disabled={form.formState.isSubmitting}
                    onClick={async () => {
                      const response = await getFunnels(subaccountId);
                      const lastFunnelPage = response.find((funnel) => funnel.id === funnelId)?.FunnelPages.length;

                      await upsertFunnelPage(
                        subaccountId,
                        {
                          ...defaultData,
                          id: v4(),
                          order: lastFunnelPage ? lastFunnelPage : 0,
                          visits: 0,
                          name: `${defaultData.name} Copy`,
                          pathName: `${defaultData.pathName}copy`,
                          content: defaultData.content,
                        },
                        funnelId,
                      );
                      toast({
                        title: 'Success',
                        description: 'Saves Funnel Page Details',
                      });
                      router.refresh();
                    }}
                    size={'icon'}
                    type="button"
                    variant={'outline'}
                  >
                    {form.formState.isSubmitting ? <Loading /> : <CopyPlusIcon />}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default CreateFunnelPage;
