-- Goals & commitments stored as a JSON array on the person.
ALTER TABLE "Person" ADD COLUMN "goals" JSONB;
