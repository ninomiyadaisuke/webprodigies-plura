'use client';
import { FunnelPage } from '@prisma/client';
import clsx from 'clsx';
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FocusEventHandler, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { saveActivityLogsNotification, upsertFunnelPage } from '@/lib/queries';
import { DeviceTypes, useEditor } from '@/providers/editor/editor-provider';

type Props = {
  funnelId: string;
  funnelPageDetails: FunnelPage;
  subaccountId: string;
};

const FunnelEditorNavigation = ({ funnelId, funnelPageDetails, subaccountId }: Props) => {
  const router = useRouter();
  const { state, dispatch } = useEditor();

  useEffect(() => {
    dispatch({
      type: 'SET_FUNNELPAGE_ID',
      payload: {
        funnelPageId: funnelPageDetails.id,
      },
    });
  }, [dispatch, funnelPageDetails.id]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.value === funnelPageDetails.name) return;
    if (event.target.value) {
      await upsertFunnelPage(
        subaccountId,
        {
          id: funnelPageDetails.id,
          name: event.target.value,
          order: funnelPageDetails.order,
        },
        funnelId,
      );

      toast('Success', {
        description: 'Saved Funnel Page title',
      });
      router.refresh();
    } else {
      toast('Oppse!', {
        description: 'You need to have a title!',
      });
      event.target.value = funnelPageDetails.name;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' });
    dispatch({ type: 'TOGGLE_LIVE_MODE' });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };
  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements);

    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...funnelPageDetails,
          content,
        },
        funnelId,
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subaccountId: subaccountId,
      });
      toast('Success', {
        description: 'Saved Editor',
      });
    } catch (error) {
      toast('Oppse!', {
        description: 'Could not save editor',
      });
    }
  };

  return (
    <TooltipProvider>
      <nav
        className={clsx('flex items-center justify-between gap-2 border-b-[1px] p-6 transition-all', {
          '!h-0 !p-0 !overflow-hidden': state.editor.previewMode,
        })}
      >
        <aside className="flex w-[300px] max-w-[260px] items-center gap-4">
          <Link href={`/subaccount/${subaccountId}/funnels/${funnelId}`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex w-full flex-col">
            <Input
              className="m-0 h-5 border-none p-0 text-lg"
              defaultValue={funnelPageDetails.name}
              onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">Path: /{funnelPageDetails.pathName}</span>
          </div>
        </aside>
        <aside>
          <Tabs
            className="w-fit"
            defaultValue="Desktop"
            onValueChange={(value) => {
              dispatch({
                type: 'CHANGE_DEVICE',
                payload: {
                  device: value as DeviceTypes,
                },
              });
            }}
            value={state.editor.device}
          >
            <TooltipProvider>
              <TabsList className="grid h-fit w-full grid-cols-3 bg-transparent">
                <Tooltip>
                  <TabsTrigger asChild className="size-10 p-0 data-[state=active]:bg-muted" value="Desktop">
                    <TooltipTrigger>
                      <Laptop />
                    </TooltipTrigger>
                  </TabsTrigger>
                  <TooltipContent>
                    <p>Desktop</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TabsTrigger asChild className="size-10 p-0 data-[state=active]:bg-muted" value="Tablet">
                    <TooltipTrigger>
                      <Tablet />
                    </TooltipTrigger>
                  </TabsTrigger>
                  <TooltipContent>
                    <p>Tablet</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TabsTrigger asChild className="size-10 p-0 data-[state=active]:bg-muted" value="Mobile">
                    <TooltipTrigger>
                      <Smartphone />
                    </TooltipTrigger>
                  </TabsTrigger>
                  <TooltipContent>
                    <p>Mobile</p>
                  </TooltipContent>
                </Tooltip>
              </TabsList>
            </TooltipProvider>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button className="hover:bg-slate-800" onClick={handlePreviewClick} size={'icon'} variant={'ghost'}>
            <EyeIcon />
          </Button>
          <Button
            className="hover:bg-slate-800"
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            size={'icon'}
            variant={'ghost'}
          >
            <Undo2 />
          </Button>
          <Button
            className="hover:bg-slate-800"
            disabled={!(state.history.currentIndex < state.history.history.length - 1)}
            onClick={handleRedo}
            size={'icon'}
            variant={'ghost'}
          >
            <Redo2 />
          </Button>
          <div className="mr-4 flex flex-col items-center">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch defaultChecked={true} disabled />
              Publish
            </div>
            <span className="text-sm text-muted-foreground">
              Last updated {funnelPageDetails.updatedAt.toLocaleDateString()}
            </span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
