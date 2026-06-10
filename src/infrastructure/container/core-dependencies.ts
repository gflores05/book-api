import { createDatabase, createDatabasePool } from '@infrastructure/config'
import { createHttpServer, createHealthRoutes } from '@infrastructure/http'
import { createUnitOfWork } from '@infrastructure/persistence'
import { asFunction, type AwilixContainer } from 'awilix'

export function registerCoreDependencies(container: AwilixContainer) {
  container.register({
    // Database
    pool: asFunction(createDatabasePool).singleton(),
    db: asFunction(createDatabase).singleton(),
    unitOfWork: asFunction(createUnitOfWork).scoped(),

    // Http Server
    httpServer: asFunction(createHttpServer).singleton(),

    // Routes
    registerHealthRoutes: asFunction(createHealthRoutes)
  })
}
