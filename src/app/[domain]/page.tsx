import { notFound } from 'next/navigation';

import { db } from '@/lib/db';
import { getDomainContent } from '@/lib/queries';
import EditorProvider from '@/providers/editor/editor-provider';

import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor';
const Page = async ({ params }: { params: { domain: string } }) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));

  const pageData = domainData?.FunnelPages.find((page) => !page.pathName);

  if (!pageData || !domainData) return notFound();

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });
  return (
    <EditorProvider funnelId={domainData.id} pageDetails={pageData} subaccountId={domainData.subAccountId}>
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default Page;
