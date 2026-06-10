import type { TObject, TProperties } from 'typebox'
import { type RouteHandlerMethod, type RouteShorthandOptions } from 'fastify'

export type ResponseStatusSquema = Record<number, TObject>

export function buildOptions<SB extends TProperties>(
  body: TObject<SB>,
  response: ResponseStatusSquema
): RouteShorthandOptions {
  return {
    schema: {
      response,
      body
    }
  }
}

export type IRoute = {
  opts: RouteShorthandOptions
  handler: RouteHandlerMethod
}
