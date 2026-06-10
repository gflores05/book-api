import { configureContainer } from '@infrastructure/container'
import type { IHttpServer, IRouteRegister } from '@infrastructure/http'
import dotenv from 'dotenv'

async function start() {
  dotenv.config()

  const container = configureContainer()

  const httpServer = container.resolve<IHttpServer>('httpServer')

  container.resolve<IRouteRegister>('registerHealthRoutes').register()
  container.resolve<IRouteRegister>('registerBookRoutes').register()

  await httpServer.start()
}

start()
