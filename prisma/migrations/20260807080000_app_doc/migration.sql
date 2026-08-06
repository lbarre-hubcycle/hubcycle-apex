-- Whole-document storage for non-person collections (OKRs, later company docs).
CREATE TABLE IF NOT EXISTS "AppDoc" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    CONSTRAINT "AppDoc_pkey" PRIMARY KEY ("id")
);
