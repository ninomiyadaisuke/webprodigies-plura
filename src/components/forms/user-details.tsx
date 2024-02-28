'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubAccount, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import { z } from 'zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from '@/lib/queries';
import { AuthUserWithAgencySigebarOptionsSubAccounts, UserWithPermissionsAndSubAccounts } from '@/lib/types';
import { useModal } from '@/providers/modal-provider';

import FileUpload from '../global/file-upload';
import Loading from '../global/loading';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { useToast } from '../ui/use-toast';

type Props = {
  id: string | null;
  type: 'agency' | 'subaccount';
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

const userDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string(),
  role: z.enum(['AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']),
});

type FormDataType = z.infer<typeof userDataSchema>;

const UserDetails = ({ id, type, userData, subAccounts }: Props) => {
  const [subAccountPermissions, setSubAccountPermissions] = useState<UserWithPermissionsAndSubAccounts | null>(null);

  const [roleState, setRoleState] = useState('');
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] = useState<AuthUserWithAgencySigebarOptionsSubAccounts | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { data, setClose } = useModal();

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails();
        if (response) setAuthUserData(response);
      };
      void fetchDetails();
    }
  }, [data]);

  const form = useForm<FormDataType>({
    mode: 'onChange',
    resolver: zodResolver(userDataSchema),
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      if (!data.user) return;
      const permission = await getUserPermissions(data.user.id);
      setSubAccountPermissions(permission);
    };

    void getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (data.user) {
      form.reset(data.user);
    }
    if (userData) {
      form.reset(userData);
    }
  }, [data, userData, form]);

  const onSubmit: SubmitHandler<FormDataType> = async (values) => {
    if (!id) return;
    if (userData || data.user) {
      const updatedUser = await updateUser(values);
      authUserData?.Agency?.SubAccount.filter(
        (subacc) => authUserData.Permissions.find((p) => p.subAccountId === subacc.id && p.access),
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
      ).forEach(async (subaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} information`,
          subaccountId: subaccount.id,
        });
      });
      if (updatedUser) {
        toast({
          title: 'Success',
          description: 'Update User Information',
        });
        setClose();
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Oppse!',
          description: 'Could not update user information',
        });
      }
    } else {
      console.log('Error could not submit');
    }
  };

  const onChangePermission = async (subAccountId: string, val: boolean, permissionsId: string | undefined) => {
    if (!data.user?.email) return;
    setLoadingPermissions(true);
    const response = await changeUserPermissions(
      permissionsId ? permissionsId : v4(),
      data.user.email,
      subAccountId,
      val,
    );

    if (type === 'agency') {
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Gave ${userData?.name} access to | ${
          subAccountPermissions?.Permissions.find((p) => p.subAccountId === subAccountId)?.SubAccount.name
        } `,
        subaccountId: subAccountPermissions?.Permissions.find((p) => p.subAccountId === subAccountId)?.SubAccount.id,
      });
    }
    if (response) {
      toast({
        title: 'Success',
        description: 'The request was successfull',
      });
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((perm) => {
          if (perm.subAccountId === subAccountId) {
            return { ...perm, access: !perm.access };
          }
          return perm;
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not update permissions',
      });
    }
    router.refresh();
    setLoadingPermissions(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              disabled={form.formState.isSubmitting}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint="avatar" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={form.formState.isSubmitting}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={form.formState.isSubmitting}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      readOnly={userData?.role === 'AGENCY_OWNER' || form.formState.isSubmitting}
                      {...field}
                    />
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
                  <Select
                    defaultValue={field.value}
                    disabled={field.value === 'AGENCY_OWNER'}
                    onValueChange={(value) => {
                      if (value === 'SUBACCOUNT_USER' || value === 'SUBACCOUNT_GUEST') {
                        setRoleState('You need to have subaccounts to assign Subaccount access to team members.');
                      } else {
                        setRoleState('');
                      }
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMING">Agency Admin</SelectItem>
                      {(data?.user?.role === 'AGENCY_OWNER' || userData?.role === 'AGENCY_OWNER') && (
                        <SelectItem value="AGENCY_OWNER">Agency Owner</SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">Sub Account User</SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">Sub Account Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">{roleState}</p>
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loading /> : 'Save User Details'}
            </Button>
            {authUserData?.role === 'AGENCY_OWNER' && (
              <div>
                <Separator className="my-4" />
                <FormLabel>User Permissions</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account access to team member by turning on access control for each Sub Account. This
                  is only visible to agency owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {subAccounts?.map((subAccount) => {
                    const subAccountPermissionsDetails = subAccountPermissions?.Permissions.find(
                      (p) => p.subAccountId === subAccount.id,
                    );
                    return (
                      <div className="flex items-center justify-between rounded-lg border p-4" key={subAccount.id}>
                        <p>{subAccount.name}</p>
                        <Switch
                          checked={subAccountPermissionsDetails?.access}
                          disabled={loadingPermissions}
                          onCheckedChange={(permission) => {
                            void onChangePermission(subAccount.id, permission, subAccountPermissionsDetails?.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
