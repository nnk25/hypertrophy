import { relations } from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

const globalForDb = globalThis as unknown as {
	db: NeonHttpDatabase<typeof relations> | undefined;
};

export const db =
	globalForDb.db ??
	drizzle({ client: neon(process.env.NEON_DB_URL!), relations });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;