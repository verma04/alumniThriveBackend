// import type { Config } from "drizzle-kit";
// import * as dotenv from "dotenv";
// dotenv.config();
// ("./");
// export default {
//   schema: "./@drizzle/src/db/schema",
//   out: "./drizzle",
//   driver: "pg",
//   dbCredentials: {
//     connectionString: process.env.POSTGRES_DATABASE_URL as string,
//   },
// } satisfies Config;
// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   dialect: "postgresql",
// });

import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config({
  path: ".env",
});
export default defineConfig({
  schema: "./@drizzle/src/db/schema",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    url: process.env.POSTGRES_DATABASE_URL as string,
  },
});
