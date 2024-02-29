/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { currentUser } from '@clerk/nextjs';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';

import InfoBar from '@/components/global/infobar';
import Sidebar from '@/components/sidebar';
import Unauthorized from '@/components/unauthorized';

import { getAuthUserDetails, getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries';

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};

const SubaccountLayout = async ({ children, params: { subaccountId } }: Props) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) return <Unauthorized />;
  const user = await currentUser();
  if (!user) {
    return redirect('/');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let notifications: any = [];

  if (!user.privateMetadata.role) {
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
    const hasPermission = allPermissions?.Permissions.find((permission) => permission.subAccountId === subaccountId);
    if (!hasPermission) {
      return <Unauthorized />;
    }

    const allNotifications = await getNotificationAndUser(agencyId);

    if (user.privateMetadata.role === 'AGENCY_ADMIN' || user.privateMetadata.role === 'AGENCY_OWNER') {
      notifications = allNotifications;
    } else {
      const filteredNoti = allNotifications.filter((item) => item.subAccountId === subaccountId);
      if (filteredNoti) notifications = filteredNoti;
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar id={subaccountId} type="subaccount" />

      <div className="md:pl-[300px]">
        <InfoBar notifications={notifications} role={user.privateMetadata.role as Role} subAccountId={subaccountId} />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default SubaccountLayout;
