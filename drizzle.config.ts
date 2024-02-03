import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./src/db/schema",
  out: "./@drizzle/drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_DATABASE_URL as string,
  },
} satisfies Config;
