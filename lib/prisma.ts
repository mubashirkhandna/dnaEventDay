import { PrismaClient } from '@prisma/client';

const g = globalThis as unknown as { _prisma?: PrismaClient };

export const prisma: PrismaClient = g._prisma ?? (g._prisma = new PrismaClient());
