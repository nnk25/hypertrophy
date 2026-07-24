import { relations } from "@/db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export const db = drizzle({client: neon(process.env.NEON_DB_URL!), relations})