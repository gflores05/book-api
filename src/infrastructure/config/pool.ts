import { Pool } from 'pg'

export interface IDatabasePool {
  getPool(): Pool
  end(): Promise<void>
}

export function createDatabasePool(
  dbHost: string,
  dbPort: number,
  dbName: string,
  dbUser: string,
  dbPassword: string,
  poolMax: number,
  poolIdleTimeoutMillis: number,
  dbConnectionTimeoutMillis: number
): IDatabasePool {
  const pool: Pool = new Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    max: poolMax, // 20
    idleTimeoutMillis: poolIdleTimeoutMillis, // 30000
    connectionTimeoutMillis: dbConnectionTimeoutMillis // 2000
  })

  pool.on('error', err => {
    console.error('Unexpected error on idle client', err)
  })

  function getPool() {
    return pool
  }

  async function end() {
    await pool.end()
  }

  return {
    getPool,
    end
  }
}
