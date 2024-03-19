import { redirect } from 'next/navigation';
import React from 'react';

import { db } from '@/lib/db';
import EditorProvider from '@/providers/editor/editor-provider';

import FunnelEditor from './_components/funnel-editor';
import FunnelEditorNavigation from './_components/funnel-editor-navigation';
import FunnelEditorSidebar from './_components/funnel-editor-sidebar';

type Props = {
  params: {
    subaccountId: string;
    funnelId: string;
    funnelPageId: string;
  };
};

const Page = async ({ params }: Props) => {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  });
  if (!funnelPageDetails) {
    return redirect(`/subaccount/${params.subaccountId}/funnels/${params.funnelId}`);
  }
  return (
    <div className="fixed inset-0 z-[20] bg-background">
      <EditorProvider funnelId={params.funnelId} pageDetails={funnelPageDetails} subaccountId={params.subaccountId}>
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountId}
        />
        <div className="flex h-full justify-center">
          <FunnelEditor funnelPageId={params.funnelPageId} />
        </div>
        <FunnelEditorSidebar subaccountId={params.subaccountId} />
      </EditorProvider>
    </div>
  );
};

export default Page;
