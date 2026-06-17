import { type TObject, type TProperties, type Static } from 'typebox'
import { type RouteHandlerMethod } from 'fastify'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { Type } from '@fastify/type-provider-typebox'
import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault
} from 'fastify'
import type { RouteGenericInterface } from 'fastify/types/route'
import type { FastifySchema } from 'fastify/types/schema'
import { Effect } from 'effect'

export type FastifyTypeBox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>

export type FastifyRequestTypeBox<TSchema extends FastifySchema> =
  FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression,
    TSchema,
    TypeBoxTypeProvider
  >

export type FastifyReplyTypeBox<TSchema extends FastifySchema> = FastifyReply<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>

export const BadRequestSchema = Type.Object({
  message: Type.String()
})

export const ForbiddenSchema = Type.Object({
  userId: Type.String({})
})

export const NotFoundSchema = Type.Object({
  resource: Type.String(),
  id: Type.String()
})

export const PreconditionFailedSchema = Type.Object({
  message: Type.String()
})

export const InternalServerErrorSchema = Type.Object({
  message: Type.String()
})

export type HttpStatusCode = 200 | 400 | 403 | 404 | 412 | 500

export type HttpErrorResponse = {
  status: HttpStatusCode
  error: HttpError
}

export type BadRequest = Static<typeof BadRequestSchema>

export function BadRequest(message: string): HttpErrorResponse {
  return { status: 400, error: { message } }
}

export type Forbidden = Static<typeof ForbiddenSchema>

export function Forbidden(userId: string): HttpErrorResponse {
  return { status: 403, error: { userId } }
}

export type NotFound = Static<typeof NotFoundSchema>

export function NotFound(resource: string, id: string): HttpErrorResponse {
  return { status: 404, error: { resource, id } }
}

export type PreconditionFailed = Static<typeof PreconditionFailedSchema>

export function PreconditionFailed(message: string): HttpErrorResponse {
  return { status: 412, error: { message } }
}

export type InternalServerError = Static<typeof InternalServerErrorSchema>

export function InternalServerError(message: string): HttpErrorResponse {
  return { status: 500, error: { message } }
}

export type HttpError = BadRequest | Forbidden | NotFound | InternalServerError

export type ResponseStatusSquema = Record<number, TObject>

export const EmptyProps = Type.Object({})

export function buildSchema<
  SB extends TProperties,
  SR extends TProperties,
  SP extends TProperties
>(body: TObject<SB>, ok: TObject<SR>, params: TObject<SP>) {
  return {
    response: {
      200: ok,
      400: BadRequestSchema,
      403: ForbiddenSchema,
      404: NotFoundSchema,
      412: PreconditionFailedSchema,
      500: InternalServerErrorSchema
    },
    body,
    params
  }
}

export function buildGetSchema<
  SR extends TProperties,
  SP extends TProperties,
  SQ extends TProperties
>(ok: TObject<SR>, params: TObject<SP>, querystring: TObject<SQ>) {
  return {
    response: {
      200: ok,
      400: BadRequestSchema,
      403: ForbiddenSchema,
      404: NotFoundSchema,
      412: PreconditionFailedSchema,
      500: InternalServerErrorSchema
    },
    params,
    querystring
  }
}

export type IRoute = {
  schema: FastifySchema
  handler: RouteHandlerMethod
}

export function runHttpPromise<T, E, R>(opts: {
  onSuccess: (v: T) => R
  onError: (e: E) => R
}) {
  return function (eff: Effect.Effect<T, E>) {
    return eff.pipe(
      Effect.map(opts.onSuccess),
      Effect.catchAll(e => Effect.succeed(opts.onError(e))),
      Effect.runPromise
    )
  }
}
