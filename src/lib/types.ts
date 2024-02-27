import { Notification, Role } from '@prisma/client';

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
