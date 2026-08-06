import { PrismaClient } from "@prisma/client";

/**
 * Lazy PrismaClient singleton. Instantiated only when the Postgres backend is
 * active (DATABASE_URL present) so the app keeps working without a database,
 * and cached on globalThis so Next.js hot reloads don't leak connections.
 */

const g = globalThis as unknown as { __apexPrisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!g.__apexPrisma) g.__apexPrisma = new PrismaClient();
  return g.__apexPrisma;
}
