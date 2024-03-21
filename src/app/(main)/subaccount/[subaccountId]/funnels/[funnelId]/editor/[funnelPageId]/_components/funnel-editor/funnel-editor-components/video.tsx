'use client';
import clsx from 'clsx';
import { Trash } from 'lucide-react';
import React, { DragEvent, MouseEvent } from 'react';

import { Badge } from '@/components/ui/badge';

import { EditorBtns } from '@/lib/constants';
import { EditorElement, useEditor } from '@/providers/editor/editor-provider';

type Props = {
  element: EditorElement;
};

const VideoComponent = ({ element }: Props) => {
  const { dispatch, state } = useEditor();
  const styles = element.styles;

  const handleDragStart = (e: DragEvent, type: EditorBtns) => {
    if (type === null) return;
    e.dataTransfer.setData('componentType', type);
  };

  const handleOnClick = (e: MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: element,
      },
    });
  };

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: {
        elementDetails: element,
      },
    });
  };

  return (
    <div
      className={clsx('relative m-[5px] flex w-full items-center justify-center p-[2px] text-[16px] transition-all', {
        '!border-blue-500': state.editor.selectedElement.id === element.id,
        '!border-solid': state.editor.selectedElement.id === element.id,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      draggable
      onClick={handleOnClick}
      onDragStart={(e) => handleDragStart(e, 'video')}
      style={styles}
    >
      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <Badge className="absolute left-[-1px] top-[-23px] rounded-none rounded-t-lg ">
          {state.editor.selectedElement.name}
        </Badge>
      )}

      {!Array.isArray(element.content) && (
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          height={element.styles.height || '315'}
          src={element.content.src}
          title="YouTube video player"
          width={element.styles.width || '560'}
        />
      )}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
        <div className="absolute right-[-1px] top-[-25px] rounded-none rounded-t-lg bg-primary  px-2.5 py-1 text-xs font-bold !text-white">
          <Trash className="cursor-pointer" onClick={handleDeleteElement} size={16} />
        </div>
      )}
    </div>
  );
};

export default VideoComponent;
