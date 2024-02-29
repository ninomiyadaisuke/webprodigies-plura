import { Notification, Prisma, Role } from '@prisma/client';

import { db } from './db';
import { getAuthUserDetails, getUserPermissions } from './queries';

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        agencyId: string;
        subAccountId: string | null;
      };
    } & Notification)[]
  | undefined;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<typeof getUserPermissions>;

export type AuthUserWithAgencySigebarOptionsSubAccounts = Prisma.PromiseReturnType<typeof getAuthUserDetails>;

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (agencyId: string) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
};

export type UsersWithAgencySubAccountPermissionsSidebarOptions = Prisma.PromiseReturnType<
  typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
>;
