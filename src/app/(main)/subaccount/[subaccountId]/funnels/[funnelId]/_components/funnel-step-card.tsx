import { FunnelPage } from '@prisma/client';
import { ArrowDown, Mail } from 'lucide-react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { createPortal } from 'react-dom';

import { Card, CardContent } from '@/components/ui/card';

type Props = {
  funnelPage: FunnelPage;
  index: number;
  activePage: boolean;
};

const FunnelStepCard = ({ funnelPage, index, activePage }: Props) => {
  const portal = document.getElementById('blur-page');
  return (
    <Draggable draggableId={funnelPage.id.toString()} index={index}>
      {(provided, snapshot) => {
        if (snapshot.isDragging) {
          const offset = { x: 300 };
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const x = provided.draggableProps.style?.left - offset.x;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          provided.draggableProps.style = {
            ...provided.draggableProps.style,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            left: x,
          };
        }
        const component = (
          <Card
            className="relative my-2 cursor-grab p-0"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <CardContent className="flex flex-row items-center gap-4 p-0">
              <div className="flex size-14 items-center justify-center bg-muted">
                <Mail />
                <ArrowDown className="absolute -bottom-2 text-primary" />
              </div>
            </CardContent>
            {activePage && <div className="absolute right-2 top-2 size-2 rounded-full bg-emerald-500" />}
          </Card>
        );
        if (!portal) return component;
        if (snapshot.isDragging) {
          return createPortal(component, portal);
        }
        return component;
      }}
    </Draggable>
  );
};

export default FunnelStepCard;
