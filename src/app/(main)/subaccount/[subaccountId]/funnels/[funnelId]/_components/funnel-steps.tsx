'use client';
import { FunnelPage } from '@prisma/client';
import { Check, ExternalLink, LucideEdit } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { DragDropContext, DragStart, DropResult, Droppable } from 'react-beautiful-dnd';

import CreateFunnelPage from '@/components/forms/funnel-page';
import CustomModal from '@/components/global/custom-modal';
import FunnelPagePlaceholder from '@/components/icons/funnel-page-placeholder';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

import { upsertFunnelPage } from '@/lib/queries';
import { FunnelsForSubAccount } from '@/lib/types';
import { useModal } from '@/providers/modal-provider';

import FunnelStepCard from './funnel-step-card';

type Props = {
  funnel: FunnelsForSubAccount;
  subaccountId: string;
  pages: FunnelPage[];
  funnelId: string;
};

const FunnelSteps = ({ funnel, subaccountId, pages, funnelId }: Props) => {
  const [clickedPage, setClickedPage] = useState<FunnelPage | undefined>(pages[0]);

  const [pagesState, setPageState] = useState(pages);
  const { setOpen } = useModal();

  useEffect(() => {
    setPageState(pages);
    setClickedPage(pages[0]);
  }, [pages]);

  const onDragStart = (event: DragStart) => {
    const { draggableId } = event;
    pages.find((page) => page.id === draggableId);
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source } = dropResult;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const pagePosition = pagesState[source.index];
    if (!pagePosition) return;

    const newPageOrder = [...pagesState]
      .toSpliced(source.index, 1)
      .toSpliced(destination.index, 0, pagePosition)
      .map((page, idx) => {
        return { ...page, order: idx };
      });

    setPageState(newPageOrder);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    newPageOrder.forEach(async (page, index) => {
      try {
        await upsertFunnelPage(
          subaccountId,
          {
            id: page.id,
            order: index,
            name: page.name,
          },
          funnelId,
        );
      } catch (error) {
        console.log(error);
        toast({
          variant: 'destructive',
          title: 'Failed',
          description: 'Could not save page order',
        });
        return;
      }
    });

    toast({
      title: 'Success',
      description: 'Saved page order',
    });
  };

  return (
    <AlertDialog>
      <div className="flex flex-col border-[1px] lg:!flex-row ">
        <aside className="flex flex-[0.3] flex-col justify-between bg-background p-6">
          <ScrollArea className="h-full">
            <div className="flex items-center gap-4">
              <Check />
              Funnel Steps
            </div>
            {pagesState.length ? (
              <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Droppable direction="vertical" droppableId="funnels" key="funnels">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {pagesState.map((page, idx) => (
                        <div className="relative" key={page.id} onClick={() => setClickedPage(page)}>
                          <FunnelStepCard
                            activePage={page.id === clickedPage?.id}
                            funnelPage={page}
                            index={idx}
                            key={page.id}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="py-6 text-center text-muted-foreground">No Pages</div>
            )}
          </ScrollArea>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setOpen(
                <CustomModal
                  subheading="Funnel Pages allow you to create step by step processes for customers to follow"
                  title=" Create or Update a Funnel Page"
                >
                  <CreateFunnelPage funnelId={funnelId} order={pagesState.length} subaccountId={subaccountId} />
                </CustomModal>,
              );
            }}
          >
            Create New Steps
          </Button>
        </aside>
        <aside className="flex-[0.7] bg-muted p-4">
          {pages.length ? (
            <Card className="flex h-full flex-col justify-between">
              <CardHeader>
                <p className="text-sm text-muted-foreground">Page name</p>
                <CardTitle>{clickedPage?.name}</CardTitle>
                <CardDescription className="flex flex-col gap-4">
                  <div className="w-full text-clip rounded-lg border-2 sm:w-80">
                    <Link
                      className="group relative"
                      href={`/subaccount/${subaccountId}/funnels/${funnelId}/editor/${clickedPage?.id}`}
                    >
                      <div className="w-full cursor-pointer group-hover:opacity-30">
                        <FunnelPagePlaceholder />
                      </div>
                      <LucideEdit
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-muted-foreground opacity-0 transition-all duration-100 group-hover:opacity-100"
                        size={50}
                      />
                    </Link>
                    <Link
                      className="group flex items-center justify-start gap-2 p-2 transition-colors duration-200 hover:text-primary"
                      href={`${process.env.NEXT_PUBLIC_SCHEME}${funnel.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${clickedPage?.pathName}`}
                      target="_blank"
                    >
                      <ExternalLink size={15} />
                      <div className="w-64 overflow-hidden text-ellipsis ">
                        {process.env.NEXT_PUBLIC_SCHEME}
                        {funnel.subDomainName}.{process.env.NEXT_PUBLIC_DOMAIN}/{clickedPage?.pathName}
                      </div>
                    </Link>
                  </div>

                  <CreateFunnelPage
                    defaultData={clickedPage}
                    funnelId={funnelId}
                    order={clickedPage?.order || 0}
                    subaccountId={subaccountId}
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="flex h-[600px] items-center justify-center text-muted-foreground">
              Create a page to view page settings.
            </div>
          )}
        </aside>
      </div>
    </AlertDialog>
  );
};

export default FunnelSteps;
