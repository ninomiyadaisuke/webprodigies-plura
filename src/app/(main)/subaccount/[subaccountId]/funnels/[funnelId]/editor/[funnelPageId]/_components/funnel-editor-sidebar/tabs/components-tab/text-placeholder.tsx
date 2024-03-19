import { TypeIcon } from 'lucide-react';
import React from 'react';

import { EditorBtns } from '@/lib/constants';

const TextPlaceholder = () => {
  const hadleDragState = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };
  return (
    <div
      className="flex size-14 items-center justify-center rounded-lg bg-muted"
      draggable
      onDragStart={(e) => hadleDragState(e, 'text')}
    >
      <TypeIcon className="text-muted-foreground" size={40} />
    </div>
  );
};

export default TextPlaceholder;
