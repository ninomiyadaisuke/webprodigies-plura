'use client';
import { Ticket } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

import LaneForm from '@/components/forms/lane-form';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';

import { LaneDetail, PipelineDetailsWithLanesCardsTagsTickets, TicketAndTags } from '@/lib/types';
import { useModal } from '@/providers/modal-provider';

import PipelineLane from './pipeline-lane';

type Props = {
  lanes: LaneDetail[];
  pipelineId: string;
  subaccountId: string;
  pipelineDetails: PipelineDetailsWithLanesCardsTagsTickets;
  updateLanesOrder: (lanes: LaneDetail[]) => Promise<void>;
  updateTicketsOrder: (tickets: Ticket[]) => Promise<void>;
};

const PipelineView = ({
  lanes,
  pipelineId,
  pipelineDetails,
  updateLanesOrder,
  updateTicketsOrder,
  subaccountId,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState<LaneDetail[]>([]);

  useEffect(() => {
    setAllLanes(lanes);
  }, [lanes]);

  const ticketsFromAllLanes: TicketAndTags[] = [];

  lanes.forEach((item) => {
    item.Tickets.forEach((i) => {
      ticketsFromAllLanes.push(i);
    });
  });

  const [allTickets, setAllTickets] = useState(ticketsFromAllLanes);

  const handleAddLane = () => {
    setOpen(
      <CustomModal subheading="Lanes allow you to group tickets" title=" Create A Lane">
        <LaneForm pipelineId={pipelineId} />
      </CustomModal>,
    );
  };

  const onDragEnd = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    switch (type) {
      case 'lane': {
        const draggedLane = allLanes[source.index];
        if (!draggedLane) return;
        const newLanes = [...allLanes]
          .toSpliced(source.index, 1)
          .toSpliced(destination.index, 0, draggedLane)
          .map((lane, idx) => {
            return { ...lane, order: idx };
          });

        setAllLanes(newLanes);
        void updateLanesOrder(newLanes);
      }

      // eslint-disable-next-line no-fallthrough
      case 'ticket': {
        const newLanes = [...allLanes];
        const originLane = newLanes.find((lane) => lane.id === source.droppableId);
        const destinationLane = newLanes.find((lane) => lane.id === destination.droppableId);

        if (!originLane || !destinationLane) {
          return;
        }

        const draggedLane = originLane.Tickets[source.index];
        if (!draggedLane) return;

        if (source.droppableId === destination.droppableId) {
          const newOrderedTickets = [...originLane.Tickets]
            .toSpliced(source.index, 1)
            .toSpliced(destination.index, 0, draggedLane)
            .map((item, idx) => {
              return { ...item, order: idx };
            });
          originLane.Tickets = newOrderedTickets;
          setAllLanes(newLanes);
          void updateTicketsOrder(newOrderedTickets);
          router.refresh();
        } else {
          const [currentTicket] = originLane.Tickets.splice(source.index, 1);
          originLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });

          if (currentTicket && currentTicket.id) {
            destinationLane.Tickets.splice(destination.index, 0, {
              ...currentTicket,
              laneId: destination.droppableId,
            });
          }

          destinationLane.Tickets.forEach((ticket, idx) => {
            ticket.order = idx;
          });
          setAllLanes(newLanes);
          void updateTicketsOrder([...destinationLane.Tickets, ...originLane.Tickets]);
          router.refresh();
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="use-automation-zoom-in rounded-xl bg-white/60 p-4 dark:bg-background/60">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl">{pipelineDetails?.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
            <Plus size={15} />
            Create Lane
          </Button>
        </div>
      </div>
      <Droppable direction="horizontal" droppableId="lanes" key="lanes" type="lane">
        {(provided) => (
          <div className="flex items-center gap-x-2 overflow-auto" ref={provided.innerRef} {...provided.droppableProps}>
            <div className="mt-4 flex">
              {allLanes.map((lane, index) => (
                <PipelineLane
                  allTickets={allTickets}
                  index={index}
                  key={lane.id}
                  laneDetails={lane}
                  pipelineId={pipelineId}
                  setAllTickets={setAllTickets}
                  subaccountId={subaccountId}
                  tickets={lane.Tickets}
                />
              ))}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PipelineView;
