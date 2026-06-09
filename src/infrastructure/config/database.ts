import type { IDatabasePool } from './pool'
import * as schema from '@infrastructure/persistence/schema'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'

export type Database = NodePgDatabase<typeof schema>

export function createDatabase(pool: IDatabasePool): Database {
  return drizzle(pool.getPool(), { schema })
}
