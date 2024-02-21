import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/no-redundant-type-constituents
  var prisma: PrismaClient | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const db = globalThis.prisma || new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
