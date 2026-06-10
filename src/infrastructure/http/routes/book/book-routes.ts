import type {
  ArchiveBookRequestType,
  CreateBookRequestType,
  IHttpServer,
  IRouteRegister,
  PublishBookRequestType,
  UpdateBookRequestType
} from '@infrastructure/http'
import { type IRoute } from '@infrastructure/util'

export function createBookRoutes(
  httpServer: IHttpServer,
  createBookRoute: IRoute,
  updateBookRoute: IRoute,
  publishBookRoute: IRoute,
  archiveBookRoute: IRoute
): IRouteRegister {
  const server = httpServer.getServer()

  return {
    register() {
      server.register(
        (app, _) => {
          app.post<{ Body: CreateBookRequestType }>(
            '/book',
            createBookRoute.opts,
            createBookRoute.handler
          )

          app.patch<{ Body: UpdateBookRequestType }>(
            '/book',
            updateBookRoute.opts,
            updateBookRoute.handler
          )

          app.patch<{ Body: PublishBookRequestType }>(
            '/book/publish',
            publishBookRoute.opts,
            publishBookRoute.handler
          )

          app.patch<{ Body: ArchiveBookRequestType }>(
            '/book/archive',
            archiveBookRoute.opts,
            archiveBookRoute.handler
          )
        },
        { prefix: '/v1' }
      )
    }
  }
}
