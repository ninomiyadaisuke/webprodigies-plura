'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Contact, Tag, User } from '@prisma/client';
import { CheckIcon, ChevronsUpDownIcon, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { getSubAccountTeamMembers, saveActivityLogsNotification, searchContacts, upsertTicket } from '@/lib/queries';
import { TicketFormSchema, TicketWithTags } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useModal } from '@/providers/modal-provider';

import Loading from '../global/loading';
import TagCreator from '../global/tag-creator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';
import { toast } from '../ui/use-toast';

type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
};

const TicketForm = ({ getNewTicket, laneId, subaccountId }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [contactList, setContactList] = useState<Contact[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState(defaultData.ticket?.Assigned?.id || '');
  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name || '',
      description: defaultData.ticket?.description || '',
      value: String(defaultData.ticket?.value || 0),
    },
  });
  const isLoading = form.formState.isLoading;

  useEffect(() => {
    if (subaccountId) {
      const fetchData = async () => {
        const response = await getSubAccountTeamMembers(subaccountId);
        if (response) setAllTeamMembers(response);
      };
      void fetchData();
    }
  }, [subaccountId]);

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || '',
        description: defaultData.ticket?.description || '',
        value: String(defaultData.ticket?.value || 0),
      });
      if (defaultData.ticket.customerId) setContact(defaultData.ticket.customerId);

      const fetchData = async () => {
        const response = await searchContacts(defaultData.ticket?.Customer?.name || '');
        setContactList(response);
      };
      void fetchData();
    }
  }, [defaultData, form]);

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;
    try {
      const response = await upsertTicket(
        {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
          assignedUserId: assignedTo,
          ...(contact ? { customerId: contact } : {}),
        },
        tags,
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a ticket | ${response?.name}`,
        subaccountId,
      });

      toast({
        title: 'Success',
        description: 'Saved  details',
      });
      if (response) getNewTicket(response);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
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
                  <FormLabel>Ticket Name</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h3>Add tags</h3>
            <TagCreator
              defaultTags={defaultData.ticket?.Tags || []}
              getSelectedTags={setTags}
              subAccountId={subaccountId}
            />
            <FormLabel>Assigned To Team Member</FormLabel>
            <Select defaultValue={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage alt="contact" />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">Not Assigned</span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem key={teamMember.id} value={teamMember.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage alt="contact" src={teamMember.avatarUrl} />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className="text-sm text-muted-foreground">{teamMember.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormLabel>Customer</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button className="justify-between" role="combobox" variant="outline">
                  {contact ? contactList.find((c) => c.id === contact)?.name : 'Select Customer...'}
                  <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    className="h-9"
                    onChangeCapture={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSearch(event.target.value);
                      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
                      saveTimerRef.current = setTimeout(() => {
                        void (async () => {
                          const response = await searchContacts(event.target.value);
                          console.log(response);

                          setContactList(response);
                          setSearch('');
                        })();
                      }, 1000);
                    }}
                    placeholder="Search..."
                    value={search}
                  />
                  <CommandEmpty>No Customer found.</CommandEmpty>
                  <CommandGroup>
                    {contactList.map((c) => (
                      <CommandItem
                        key={c.id}
                        onSelect={(currentValue) => {
                          setContact(currentValue === contact ? '' : currentValue);
                        }}
                        value={c.id}
                      >
                        {c.name}
                        <CheckIcon className={cn('ml-auto h-4 w-4', contact === c.id ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Button className="mt-4 w-20" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
