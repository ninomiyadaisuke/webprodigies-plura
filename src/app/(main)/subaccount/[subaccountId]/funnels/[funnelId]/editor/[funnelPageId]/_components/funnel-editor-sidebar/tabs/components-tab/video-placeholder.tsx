import { Youtube } from 'lucide-react';
import React from 'react';

import { EditorBtns } from '@/lib/constants';

const VideoPlaceholder = () => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };
  return (
    <div
      className="flex size-14 items-center justify-center rounded-lg bg-muted"
      draggable
      onDragStart={(e) => handleDragStart(e, 'video')}
    >
      <Youtube className="text-muted-foreground" size={40} />
    </div>
  );
};

export default VideoPlaceholder;
