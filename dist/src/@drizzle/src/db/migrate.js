"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
require("dotenv/config");
const pool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_DATABASE_URL,
});
const db = (0, node_postgres_1.drizzle)(pool);
async function main() {
    console.log('migration started...');
    await (0, migrator_1.migrate)(db, { migrationsFolder: 'drizzle' });
    console.log('migration ended...');
    process.exit(0);
}
main().catch((err) => {
    console.log(err);
    process.exit(0);
});
