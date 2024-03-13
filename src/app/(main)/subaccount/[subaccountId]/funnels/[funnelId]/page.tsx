import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

import BlurPage from '@/components/global/blur-page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getFunnel } from '@/lib/queries';

import FunnelSettings from './_components/funnel-settings';
import FunnelSteps from './_components/funnel-steps';

type Props = {
  params: { funnelId: string; subaccountId: string };
};

const FunnelPage = async ({ params }: Props) => {
  const funnelPages = await getFunnel(params.funnelId);
  if (!funnelPages) return redirect(`/subaccount/${params.subaccountId}/funnels`);

  return (
    <BlurPage>
      <Link
        className="mb-4 flex justify-between gap-4 text-muted-foreground"
        href={`/subaccount/${params.subaccountId}/funnels`}
      >
        Back
      </Link>
      <h1 className="mb-8 text-3xl">{funnelPages.name}</h1>
      <Tabs className="w-full" defaultValue="steps">
        <TabsList className="grid w-[50%] grid-cols-2 bg-transparent">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            funnelId={params.funnelId}
            pages={funnelPages.FunnelPages}
            subaccountId={params.subaccountId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings defaultData={funnelPages} subaccountId={params.subaccountId} />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelPage;
