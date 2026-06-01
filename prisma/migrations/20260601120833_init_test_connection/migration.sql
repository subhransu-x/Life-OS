-- CreateTable
CREATE TABLE "TestConnection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "TestConnection_pkey" PRIMARY KEY ("id")
);
