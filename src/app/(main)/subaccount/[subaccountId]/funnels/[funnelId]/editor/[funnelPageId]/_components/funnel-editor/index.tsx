'use client';
import clsx from 'clsx';
import { EyeOff } from 'lucide-react';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { getFunnelPageDetails } from '@/lib/queries';
import { useEditor } from '@/providers/editor/editor-provider';

import Recursive from './funnel-editor-components/recursive';

type Props = { funnelPageId: string; liveMode?: boolean };

const FunnelEditor = ({ funnelPageId, liveMode }: Props) => {
  const { dispatch, state } = useEditor();

  useEffect(() => {
    if (liveMode) {
      dispatch({ type: 'TOGGLE_LIVE_MODE', payload: { value: true } });
    }
  }, [dispatch, liveMode]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFunnelPageDetails(funnelPageId);
      if (!response) return;
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          elements: response.content ? JSON.parse(response?.content) : '',
          withLive: !!liveMode,
        },
      });
    };
    void fetchData();
  }, [dispatch, funnelPageId, liveMode]);

  const handleClick = () => {
    dispatch({ type: 'CHANGE_CLICKED_ELEMENT', payload: {} });
  };

  const handleUnpreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' });
    dispatch({ type: 'TOGGLE_LIVE_MODE' });
  };

  return (
    <div
      className={clsx(
        'use-automation-zoom-in mr-[385px] h-full overflow-scroll rounded-md bg-background transition-all',
        {
          '!p-0 !mr-0': state.editor.previewMode === true || state.editor.liveMode === true,
          '!w-[850px]': state.editor.device === 'Tablet',
          '!w-[420px]': state.editor.device === 'Mobile',
          'w-full': state.editor.device === 'Desktop',
        },
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          className="fixed left-0 top-0 z-[100] size-6 bg-slate-600 p-[2px]"
          onClick={handleUnpreview}
          size={'icon'}
          variant={'ghost'}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => <Recursive element={childElement} key={childElement.id} />)}
    </div>
  );
};

export default FunnelEditor;
