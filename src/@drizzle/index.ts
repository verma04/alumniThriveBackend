import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'
import * as schema from './src/db/schema'
const client = new Client({
    connectionString: process.env.POSTGRES_DATABASE_URL,
})

client.connect()

export const db = drizzle(client, { schema })
