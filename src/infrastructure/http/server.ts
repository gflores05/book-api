import Fastify, { type FastifyInstance } from 'fastify'

export interface IHttpServer {
  start(): Promise<void>
  getServer(): FastifyInstance
}

export function createHttpServer(httpPort: number): IHttpServer {
  const server = Fastify({})

  return {
    start,
    getServer
  }

  async function start() {
    try {
      await server.listen({ port: httpPort })

      const address = server.server.address()

      server.log.info(`Service listening at ${address}:${httpPort}`)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }

  function getServer() {
    return server
  }
}
