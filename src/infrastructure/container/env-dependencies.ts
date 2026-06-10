import { asValue, type AwilixContainer } from 'awilix'

export function registeEnvDependencies(container: AwilixContainer) {
  container.register({
    // Database
    dbHost: asValue(process.env.DATABASE_HOST),
    dbPort: asValue(Number(process.env.DATABASE_PORT)),
    dbName: asValue(process.env.DATABASE_NAME),
    dbUser: asValue(process.env.DATABASE_USER),
    dbPassword: asValue(process.env.DATABASE_PASSWORD),
    poolMax: asValue(Number(process.env.POOL_MAX)),
    poolIdleTimeoutMillis: asValue(
      Number(process.env.POOL_IDLE_TIMEOUT_MILLIS)
    ),
    dbConnectionTimeoutMillis: asValue(
      Number(process.env.DB_CONNECTION_TIMEOUT_MILLIS)
    ),

    // Http
    httpPort: asValue(Number(process.env.HTTP_PORT))
  })
}
