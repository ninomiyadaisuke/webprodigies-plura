'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Agency, SubAccount } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { saveActivityLogsNotification, upsertSubAccount } from '@/lib/queries';
import { useModal } from '@/providers/modal-provider';

import FileUpload from '../global/file-upload';
import Loading from '../global/loading';
import { useToast } from '../ui/use-toast';

const formSchema = z.object({
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
});

//CHALLENGE Give access for Subaccount Guest they should see a different view maybe a form that allows them to create tickets

//CHALLENGE layout.tsx oonly runs once as a result if you remove permissions for someone and they keep navigating the layout.tsx wont fire again. solution- save the data inside metadata for current user.

interface SubAccountDetailsProps {
  //To add the sub account to the agency
  agencyDetails: Agency;
  details?: Partial<SubAccount>;
  userName: string;
}

const SubAccountDetails: React.FC<SubAccountDetailsProps> = ({ details, agencyDetails, userName }) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: details?.name,
      companyEmail: details?.companyEmail,
      companyPhone: details?.companyPhone,
      address: details?.address,
      city: details?.city,
      zipCode: details?.zipCode,
      state: details?.state,
      country: details?.country,
      subAccountLogo: details?.subAccountLogo,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await upsertSubAccount({
        id: details?.id ? details.id : v4(),
        address: values.address,
        subAccountLogo: values.subAccountLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        zipCode: values.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        agencyId: agencyDetails.id,
        connectAccountId: '',
        goal: 5000,
      });
      if (!response) throw new Error('No response from server');
      await saveActivityLogsNotification({
        agencyId: response.agencyId,
        description: `${userName} | updated sub account | ${response.name}`,
        subaccountId: response.id,
      });

      toast({
        title: 'Subaccount details saved',
        description: 'Successfully saved your subaccount details.',
      });

      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save sub account details.',
      });
    }
  }

  useEffect(() => {
    if (details) {
      form.reset(details);
    }
  }, [details, form]);

  const isLoading = form.formState.isSubmitting;
  //CHALLENGE Create this form.
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sub Account Information</CardTitle>
        <CardDescription>Please enter business details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={isLoading}
              name="subAccountLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Logo</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint="subaccountLogo" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 md:flex-row">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your agency name" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isLoading}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Acount Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 md:flex-row">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Acount Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              disabled={isLoading}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 st..." required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 md:flex-row">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isLoading}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={isLoading}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zipcpde</FormLabel>
                    <FormControl>
                      <Input placeholder="Zipcode" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              disabled={isLoading}
              name="country"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit">
              {isLoading ? <Loading /> : 'Save Account Information'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubAccountDetails;
