/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client';
import clsx from 'clsx';
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

import { icons } from '@/lib/constants';
import { useModal } from '@/providers/modal-provider';

import SubAccountDetails from '../forms/subaccount-details';
import CustomModal from '../global/custom-modal';
import { AspectRatio } from '../ui/aspect-ratio';
import { Button } from '../ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
};

const MenuOptions = ({ details, sidebarLogo, sidebarOpt, subAccounts, user, defaultOpen }: Props) => {
  const { setOpen } = useModal();
  const [isMounted, setIsMounted] = useState(false);
  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return;

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger asChild className="absolute left-4 top-4 z-[100] flex md:!hidden">
        <Button size={'icon'} variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        className={clsx('fixed top-0 border-r-[1px] bg-background/80 p-6 backdrop-blur-xl', {
          'hidden md:inline-block z-0 w-[300px]': defaultOpen,
          'inline-block md:hidden z-[100] w-full': !defaultOpen,
        })}
        showX={!defaultOpen}
        side={'left'}
      >
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image alt="Sidebar Logo" className="rounded-md object-contain" fill src={sidebarLogo} />
          </AspectRatio>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="my-4 flex w-full items-center justify-between" variant={'ghost'}>
                <div className="flex items-center gap-2 text-left">
                  <Compass />
                  <div className="flex flex-col">
                    {details.name}
                    <span className="text-muted-foreground">{details.address}</span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown className="text-muted-foreground" size={16} />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[200] mt-4 size-80">
              <Command className="rounded-lg">
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="pb-16">
                  <CommandEmpty> No results found</CommandEmpty>
                  {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') && user?.Agency && (
                    <CommandGroup heading="Agency">
                      <CommandItem className="my-2 cursor-pointer rounded-md border-[1px] border-border !bg-transparent p-2 text-primary transition-all hover:!bg-muted">
                        {defaultOpen ? (
                          <Link className="flex size-full gap-4" href={`/agency/${user?.Agency?.id}`}>
                            <div className="relative w-16">
                              <Image
                                alt="Agency Logo"
                                className="rounded-md object-contain"
                                fill
                                src={user?.Agency?.agencyLogo}
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              {user?.Agency?.name}
                              <span className="text-muted-foreground">{user?.Agency?.address}</span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link className="flex size-full gap-4" href={`/agency/${user?.Agency?.id}`}>
                              <div className="relative w-16">
                                <Image
                                  alt="Agency Logo"
                                  className="rounded-md object-contain"
                                  fill
                                  src={user?.Agency?.agencyLogo}
                                />
                              </div>
                              <div className="flex flex-1 flex-col">
                                {user?.Agency?.name}
                                <span className="text-muted-foreground">{user?.Agency?.address}</span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  )}
                  <CommandGroup heading="Accounts">
                    {subAccounts
                      ? subAccounts.map((subaccount) => (
                          <CommandItem key={subaccount.id}>
                            {defaultOpen ? (
                              <Link className="flex size-full gap-4" href={`/subaccount/${subaccount.id}`}>
                                <div className="relative w-16">
                                  <Image
                                    alt="subaccount Logo"
                                    className="rounded-md object-contain"
                                    fill
                                    src={subaccount.subAccountLogo}
                                  />
                                </div>
                                <div className="flex flex-1 flex-col">
                                  {subaccount.name}
                                  <span className="text-muted-foreground">{subaccount.address}</span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link className="flex size-full gap-4" href={`/subaccount/${subaccount.id}`}>
                                  <div className="relative w-16">
                                    <Image
                                      alt="subaccount Logo"
                                      className="rounded-md object-contain"
                                      fill
                                      src={subaccount.subAccountLogo}
                                    />
                                  </div>
                                  <div className="flex flex-1 flex-col">
                                    {subaccount.name}
                                    <span className="text-muted-foreground">{subaccount.address}</span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      : 'No Accounts'}
                  </CommandGroup>
                </CommandList>
                {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') && (
                  <SheetClose>
                    <Button
                      className="flex w-full gap-2"
                      onClick={() => {
                        setOpen(
                          <CustomModal
                            subheading="You can switch between your agency account and the subaccount from the sidebar"
                            title="Create Sub Account"
                          >
                            <SubAccountDetails agencyDetails={user?.Agency as Agency} userName={user?.name} />
                          </CustomModal>,
                        );
                      }}
                    >
                      <PlusCircleIcon size={15} />
                      Create Sub Account
                    </Button>
                  </SheetClose>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <p className="mb-2 text-xs text-muted-foreground">MENU LINKS</p>
          <Separator className="mb-4" />
          <nav className="relative">
            <Command className="overflow-visible rounded-lg bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  {sidebarOpt.map((sidebarOptions) => {
                    let val;
                    const result = icons.find((icon) => icon.value === sidebarOptions.icon);
                    if (result) {
                      val = <result.path />;
                    }

                    return (
                      <CommandItem className="w-full md:w-[320px]" key={sidebarOptions.id}>
                        <Link
                          className="flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent md:w-full"
                          href={sidebarOptions.link}
                        >
                          {val}
                          <span>{sidebarOptions.name}</span>
                        </Link>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
