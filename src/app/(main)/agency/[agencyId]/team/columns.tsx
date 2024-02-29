'use client';

import { Role } from '@prisma/client';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import UserDetails from '@/components/forms/user-details';
import CustomModal from '@/components/global/custom-modal';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

import { deleteUser, getUser } from '@/lib/queries';
import { UsersWithAgencySubAccountPermissionsSidebarOptions } from '@/lib/types';
import { useModal } from '@/providers/modal-provider';

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] = [
  {
    accessorKey: 'id',
    header: '',
    cell: () => {
      return null;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const avatarUrl = row.getValue('avatarUrl');
      return (
        <div className="flex items-center gap-4">
          <div className="relative size-10 flex-none">
            <Image alt="avatar image" className="rounded-full object-cover" fill src={avatarUrl as string} />
          </div>
          <span>{row.getValue('name')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'avatarUrl',
    header: '',
    cell: () => {
      return null;
    },
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'SubAccount',
    header: 'Owned Accounts',
    cell: ({ row }) => {
      const isAgencyOwner = row.getValue('role') === 'AGENCY_OWNER';
      const ownedAccounts = row.original?.Permissions.filter((per) => per.access);
      if (isAgencyOwner) {
        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              <Badge className="whitespace-nowrap bg-slate-600">Agency - {row?.original?.Agency?.name}</Badge>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-start">
          <div className="flex flex-col gap-2">
            {ownedAccounts?.length ? (
              ownedAccounts.map((account) => (
                <Badge className="w-fit whitespace-nowrap bg-slate-600" key={account.id}>
                  Sub Account - {account.SubAccount.name}
                </Badge>
              ))
            ) : (
              <div className="text-muted-foreground">No Access Yet</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role: Role = row.getValue('role');
      return (
        <Badge
          className={clsx({
            'bg-emerald-500': role === 'AGENCY_OWNER',
            'bg-orange-400': role === 'AGENCY_ADMIN',
            'bg-primary': role === 'SUBACCOUNT_USER',
            'bg-muted': role === 'SUBACCOUNT_GUEST',
          })}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    },
  },
];

type CellActionsProps = {
  rowData: UsersWithAgencySubAccountPermissionsSidebarOptions;
};

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  if (!rowData) return;
  if (!rowData.Agency) return;
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className="flex gap-2" onClick={() => navigator.clipboard.writeText(rowData.email)}>
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal
                  subheading="You can change permissions only when the user has an owned subaccount"
                  title="Edit User Details"
                >
                  <UserDetails
                    id={rowData?.Agency?.id || null}
                    subAccounts={rowData?.Agency?.SubAccount}
                    type="agency"
                  />
                </CustomModal>,
                async () => {
                  return { user: await getUser(rowData?.id) };
                },
              );
            }}
          >
            <Edit size={15} /> Edit Details
          </DropdownMenuItem>
          {rowData.role !== 'AGENCY_OWNER' && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await deleteUser(rowData.id);
              toast({
                title: 'Deleted User',
                description: 'The user has been deleted from this agency they no longer have access to the agency',
              });
              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
