import Image from 'next/image';
import React from 'react';

import { EditorBtns } from '@/lib/constants';

const CheckoutPlaceholder = () => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };
  return (
    <div
      className=" flex size-14 items-center justify-center rounded-lg bg-muted"
      draggable
      onDragStart={(e) => handleDragStart(e, 'paymentForm')}
    >
      <Image alt="stripe logo" className="object-cover" height={40} src="/stripelogo.png" width={40} />
    </div>
  );
};

export default CheckoutPlaceholder;
