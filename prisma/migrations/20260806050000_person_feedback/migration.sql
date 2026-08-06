-- Instant feedback items stored as a JSON array on the recipient person.
ALTER TABLE "Person" ADD COLUMN "feedback" JSONB;
