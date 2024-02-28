import { currentUser } from '@clerk/nextjs';
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';

import AgencyDetails from '@/components/forms/agency-details';

import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries';

const Page = async ({ searchParams }: { searchParams: { plan: Plan; state: string; code: string } }) => {
  const agencyId = await verifyAndAcceptInvitation();

  //get the users details
  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
      return redirect('/subaccount');
    } else if (user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') {
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split('___')[0];
        const stateAgencyId = searchParams.state.split('___')[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
      } else return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not authorized</div>;
    }
  }

  const authUser = await currentUser();
  return (
    <div className="mt-4 flex items-center justify-center">
      <div className="max-w-[850px] rounded-xl border-[1px] p-4">
        <h1 className="text-4xl"> Create An Agency</h1>
        <AgencyDetails data={{ companyEmail: authUser?.emailAddresses[0]?.emailAddress }} />
      </div>
    </div>
  );
};

export default Page;
