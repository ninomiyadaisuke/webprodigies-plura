import { currentUser } from '@clerk/nextjs';
import React from 'react';

import AgencyDetails from '@/components/forms/agency-details';
import UserDetails from '@/components/forms/user-details';

import { db } from '@/lib/db';

type Props = {
  params: {
    agencyId: string;
  };
};

const SettingsPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0]?.emailAddress,
    },
  });

  if (!userDetails) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <div className="flex flex-col gap-4 lg:!flex-row">
      <AgencyDetails data={agencyDetails} />
      <UserDetails id={params.agencyId} subAccounts={subAccounts} type="agency" userData={userDetails} />
    </div>
  );
};

export default SettingsPage;
