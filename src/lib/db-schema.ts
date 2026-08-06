/**
 * Idempotent schema statements (IF NOT EXISTS everywhere) — the single
 * source of truth for columns/tables added after the initial migration.
 * Applied by /api/admin/migrate and, self-healingly, by the storage layer
 * whenever a query fails because the database lags behind the code.
 */
export const SCHEMA_STATEMENTS = [
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "feedback" JSONB',
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "goals" JSONB',
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "oneOnOnes" JSONB',
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "reviews" JSONB',
  'CREATE TABLE IF NOT EXISTS "AppDoc" ("id" TEXT NOT NULL, "data" JSONB NOT NULL, CONSTRAINT "AppDoc_pkey" PRIMARY KEY ("id"))',
];
