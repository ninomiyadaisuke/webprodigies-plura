'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { saveActivityLogsNotification, sendInvitation } from '@/lib/queries';

import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../ui/use-toast';


type Props = {
  agencyId: string;
};

const userdataSchema = z.object({
  email: z.string().email(),
  role: z.enum(['AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']),
});

type UserDataType = z.infer<typeof userdataSchema>;

const SendInvitation = ({ agencyId }: Props) => {
  const { toast } = useToast();

  const form = useForm<UserDataType>({
    resolver: zodResolver(userdataSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      role: 'SUBACCOUNT_USER',
    },
  });

  const onSubmit: SubmitHandler<UserDataType> = async (values) => {
    try {
      const res = await sendInvitation(values.role, values.email, agencyId);

      await saveActivityLogsNotification({
        agencyId,
        description: `Invitation to ${res.email}`,
        subaccountId: undefined,
      });
      toast({
        title: 'Success',
        description: 'Created and sent invitation',
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not send invitation',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an invitation sent out to their email, will not
          receive another invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={form.formState.isSubmitting}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={form.formState.isSubmitting}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">Agency Admin</SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">Sub Account User</SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">Sub Account Guest</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : 'Send Invitation'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
