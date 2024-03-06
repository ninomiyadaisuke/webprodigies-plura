'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { saveActivityLogsNotification, upsertContact } from '@/lib/queries';
import { useModal } from '@/providers/modal-provider';

import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
type Props = {
  subaccountId: string;
};

const ContactUserFormSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email(),
});

type FormDataType = z.infer<typeof ContactUserFormSchema>;

const ContactUserForm = ({ subaccountId }: Props) => {
  const { setClose, data } = useModal();
  const router = useRouter();
  const form = useForm<FormDataType>({
    mode: 'onChange',
    resolver: zodResolver(ContactUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (data.contact) {
      form.reset(data.contact);
    }
  }, [data, form]);

  const isLoading = form.formState.isLoading;

  const handleSubmit: SubmitHandler<FormDataType> = async (values) => {
    try {
      const response = await upsertContact({
        email: values.email,
        subAccountId: subaccountId,
        name: values.name,
      });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a contact | ${response?.name}`,
        subaccountId: subaccountId,
      });
      toast({
        title: 'Success',
        description: 'Saved funnel details',
      });
      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save funnel details',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Info</CardTitle>
        <CardDescription>
          You can assign tickets to contacts and set a value for each contact in the ticket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              disabled={isLoading}
              name="name"
              render={({ field }) => (
                <FormItem>
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
              disabled={isLoading}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : 'Save Contact Details!'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactUserForm;
