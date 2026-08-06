-- Performance reviews stored as a JSON array on the employee.
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "reviews" JSONB;
