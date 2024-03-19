import { Contact2Icon } from 'lucide-react';
import React from 'react';

import { EditorBtns } from '@/lib/constants';

const ContactFormComponentPlaceholder = () => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };
  return (
    <div
      className=" flex size-14 items-center justify-center rounded-lg bg-muted"
      draggable
      onDragStart={(e) => handleDragStart(e, 'contactForm')}
    >
      <Contact2Icon className="text-muted-foreground" size={40} />
    </div>
  );
};

export default ContactFormComponentPlaceholder;
