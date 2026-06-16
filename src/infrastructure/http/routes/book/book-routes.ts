import type {
  ArchiveBookRequestType,
  CreateBookRequestType,
  GetBookRequestType,
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
  archiveBookRoute: IRoute,
  getBookRoute: IRoute
): IRouteRegister {
  const server = httpServer.getServer()

  return {
    register() {
      server.register(
        (app, _) => {
          app.post<{ Body: CreateBookRequestType }>(
            '/book',
            { schema: createBookRoute.schema },
            createBookRoute.handler
          )

          app.patch<{ Body: UpdateBookRequestType }>(
            '/book',
            { schema: updateBookRoute.schema },
            updateBookRoute.handler
          )

          app.patch<{ Body: PublishBookRequestType }>(
            '/book/publish',
            { schema: publishBookRoute.schema },
            publishBookRoute.handler
          )

          app.patch<{ Body: ArchiveBookRequestType }>(
            '/book/archive',
            { schema: archiveBookRoute.schema },
            archiveBookRoute.handler
          )

          app.get<{ Params: GetBookRequestType }>(
            '/book/:actorUserId/:id',
            { schema: getBookRoute.schema },
            getBookRoute.handler
          )
        },
        { prefix: '/v1' }
      )
    }
  }
}
