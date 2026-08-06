-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "roleId" TEXT,
    "teamId" TEXT,
    "functionalTeamId" TEXT,
    "managerId" TEXT,
    "dottedManagerId" TEXT,
    "userRole" TEXT,
    "language" TEXT,
    "invitedAt" TEXT NOT NULL,
    "completedAt" TEXT,
    "answers" JSONB,
    "results" JSONB,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_token_key" ON "Person"("token");
