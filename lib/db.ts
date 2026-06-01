import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
