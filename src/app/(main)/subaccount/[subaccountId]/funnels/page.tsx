import { Plus } from 'lucide-react';
import React from 'react';

import FunnelForm from '@/components/forms/funnel-form';
import BlurPage from '@/components/global/blur-page';

import { getFunnels } from '@/lib/queries';

import { columns } from './[funnelId]/columns';
import FunnelsDataTable from './[funnelId]/data-table';

const Funnels = async ({ params }: { params: { subaccountId: string } }) => {
  const funnels = await getFunnels(params.subaccountId);

  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        columns={columns}
        data={funnels}
        filterValue="name"
        modalChildren={<FunnelForm subAccountId={params.subaccountId} />}
      />
    </BlurPage>
  );
};

export default Funnels;
