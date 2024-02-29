import { currentUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import React from 'react';

import SendInvitation from '@/components/forms/send-invitation';

import { db } from '@/lib/db';

import { columns } from './columns';
import DataTable from './data-table';


type Props = {
  params: { agencyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: {
        include: {
          SubAccount: true,
        },
      },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus />
          Add
        </>
      }
      columns={columns}
      data={teamMembers}
      filterValue="name"
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
    />
  );
};

export default TeamPage;
