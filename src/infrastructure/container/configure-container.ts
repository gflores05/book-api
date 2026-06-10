import * as awilix from 'awilix'
import { registeEnvDependencies } from './env-dependencies'
import { registerCoreDependencies } from './core-dependencies'
import { registerBook } from './book-dependencies'

export function configureContainer() {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    strict: true
  })

  registeEnvDependencies(container)
  registerCoreDependencies(container)
  registerBook(container)

  return container
}
