import { SubAccount } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

import { getAuthUserDetails } from '@/lib/queries';

import CreateSubaccountButton from './_components/create-subaccount-btn';
import DeleteButton from './_components/delete-button';

const AllSubaccountsPage = async () => {
  const user = await getAuthUserDetails();
  if (!user) return;
  return (
    <AlertDialog>
      <div className="flex flex-col">
        <CreateSubaccountButton className="m-6 w-[200px] self-end" user={user} />
      </div>
      <Command className="rounded-lg bg-transparent">
        <CommandInput placeholder="Search Acount..." />
        <CommandList>
          <CommandEmpty>No Results Found.</CommandEmpty>
          <CommandGroup heading="Sub Accounts">
            {user.Agency?.SubAccount.length ? (
              user.Agency.SubAccount.map((subaccount: SubAccount) => (
                <CommandItem
                  className="my-2 h-32 cursor-pointer rounded-lg border-[1px] border-border !bg-background p-4 text-primary transition-all hover:!bg-background"
                  key={subaccount.id}
                >
                  <Link className="flex size-full gap-4" href={`/subaccount/${subaccount.id}`}>
                    <div className="relative w-32">
                      <Image
                        alt="subaccount logo"
                        className="rounded-md bg-muted/50 object-contain p-4"
                        fill
                        src={subaccount.subAccountLogo}
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col">
                        {subaccount.name}
                        <span className="text-xs text-muted-foreground">{subaccount.address}</span>
                      </div>
                    </div>
                  </Link>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-20 !text-white hover:bg-red-600 hover:text-white"
                      size={'sm'}
                      variant={'destructive'}
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle> Are your absolutely sure</AlertDialogTitle>
                      <AlertDescription className="text-left">
                        This action cannot be undon. This will delete the subaccount and all data related to the
                        subaccount.
                      </AlertDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center">
                      <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="mb-2 bg-destructive hover:bg-destructive">
                        <DeleteButton subaccountId={subaccount.id} />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </CommandItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">No Sub accounts</div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
    </AlertDialog>
  );
};

export default AllSubaccountsPage;
