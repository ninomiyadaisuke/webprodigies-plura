import React from 'react';

import { EditorBtns } from '@/lib/constants';

const TwoColumnsPlaceholder = () => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };
  return (
    <div
      className=" flex size-14 flex-row gap-[4px] rounded-lg bg-muted/70 p-2"
      draggable
      onDragStart={(e) => handleDragStart(e, '2Col')}
    >
      <div className="size-full rounded-sm border-[1px] border-dashed border-muted-foreground/50 bg-muted"></div>
      <div className="size-full rounded-sm border-[1px] border-dashed border-muted-foreground/50 bg-muted"></div>
    </div>
  );
};

export default TwoColumnsPlaceholder;
