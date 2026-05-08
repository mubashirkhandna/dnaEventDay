import { PrismaClient } from '@prisma/client';

const g = globalThis as unknown as { _prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (!g._prisma) {
    g._prisma = new PrismaClient();
  }
  return g._prisma;
}

// Lazy proxy — PrismaClient is only instantiated on first DB call,
// not at module load. Prevents function crash when DATABASE_URL is missing.
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getClient();
    const val = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof val === 'function' ? (val as Function).bind(client) : val;
  },
});
