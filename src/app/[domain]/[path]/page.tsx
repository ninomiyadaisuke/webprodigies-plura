import { notFound } from 'next/navigation';
import React from 'react';

import FunnelEditor from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor';
import { getDomainContent } from '@/lib/queries';
import EditorProvider from '@/providers/editor/editor-provider';

const Page = async ({ params }: { params: { domain: string; path: string } }) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find((page) => page.pathName === params.path);

  if (!pageData || !domainData) return notFound();

  return (
    <EditorProvider funnelId={domainData.id} pageDetails={pageData} subaccountId={domainData.subAccountId}>
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
