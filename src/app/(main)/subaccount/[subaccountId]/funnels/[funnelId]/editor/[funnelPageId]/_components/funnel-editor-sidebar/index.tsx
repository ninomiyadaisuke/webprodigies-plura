'use client';

import { TabsContent } from '@radix-ui/react-tabs';
import clsx from 'clsx';
import React from 'react';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs } from '@/components/ui/tabs';

import { useEditor } from '@/providers/editor/editor-provider';

import TabList from './tabs';
type Props = {
  subaccountId: string;
};

const FunnelEditorSidebar = ({ subaccountId }: Props) => {
  console.log(subaccountId);

  const { state } = useEditor();
  return (
    <Sheet modal={false} open={true}>
      <Tabs className="w-full" defaultValue="Settings">
        <SheetContent
          className={clsx('z-[80] mt-[97px] w-16 overflow-hidden p-0 shadow-none transition-all focus:border-none', {
            hidden: state.editor.previewMode,
          })}
          showX={false}
          side="right"
        >
          <TabList />
        </SheetContent>
        <SheetContent
          className={clsx(
            'z-[40] mr-16 mt-[97px] h-full w-80 overflow-hidden bg-background p-0 shadow-none transition-all ',
            { hidden: state.editor.previewMode },
          )}
          showX={false}
          side="right"
        >
          <div className="grid h-full gap-4 overflow-auto pb-36">
            <TabsContent value="Settings">
              <SheetHeader className="p-6 text-left">
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you like.
                </SheetDescription>
              </SheetHeader>
            </TabsContent>
            <TabsContent value="Media"></TabsContent>
            <TabsContent value="Components">
              <SheetHeader className="p-6 text-left ">
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>You can drag and drop components on the canvas</SheetDescription>
              </SheetHeader>
              {/* <ComponentsTab /> */}
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  );
};

export default FunnelEditorSidebar;
