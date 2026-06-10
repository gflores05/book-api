import type { IHttpServer, IRouteRegister } from '@infrastructure/http'
import type { RouteOptions } from 'fastify'

const healthRoute: RouteOptions = {
  method: 'GET',
  url: '/ping',
  handler: async (_, _2) => {
    return { pong: 'it worked!' }
  },
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string'
          }
        }
      }
    }
  }
}

export function createHealthRoutes(httpServer: IHttpServer): IRouteRegister {
  const server = httpServer.getServer()

  return {
    register() {
      server.register((app, _, done) => {
        app.route(healthRoute)

        done()
      })
    }
  }
}
