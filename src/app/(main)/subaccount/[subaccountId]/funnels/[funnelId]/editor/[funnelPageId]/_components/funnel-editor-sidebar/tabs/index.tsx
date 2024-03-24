import { Database, Plus, SettingsIcon, SquareStackIcon } from 'lucide-react';
import React from 'react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

const TabList = () => {
  return (
    <TabsList className="flex h-fit w-full flex-col items-center justify-evenly gap-4 bg-transparent">
      <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="Settings">
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="Components">
        <Plus />
      </TabsTrigger>
      <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="Layers">
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger className="size-10 p-0 data-[state=active]:bg-muted" value="Media">
        <Database />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
