import type {
  GetBookResult,
  GetBookError,
  GetBookQuery
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  GetBookRequest,
  GetBookResponse,
  type GetBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import {
  buildGetSchema,
  Forbidden,
  InternalServerError,
  NotFound,
  runHttpPromise,
  type FastifyReplyTypeBox,
  type FastifyRequestTypeBox,
  type HttpErrorResponse
} from '@infrastructure/util'
import { Effect, Match } from 'effect'

export function createGetBookRoute(
  getBookQueryHandler: ICommandHandler<
    GetBookQuery,
    GetBookResult,
    GetBookError
  >
) {
  const schema = buildGetSchema(GetBookResponse, GetBookRequest)

  const handler = async function (
    request: FastifyRequestTypeBox<typeof schema>,
    reply: FastifyReplyTypeBox<typeof schema>
  ): Promise<GetBookResponseType> {
    const query = BookDtoMapper.mapGetDtoToQuery(request.params)

    return getBookQueryHandler.handle(query).pipe(
      Effect.mapError(
        Match.type<GetBookError>().pipe(
          Match.withReturnType<HttpErrorResponse>(),
          Match.tag('BookNotExistGetError', e => NotFound('book', e.id)),
          Match.tag('DeniedGetError', e => Forbidden(e.actorUserId)),
          Match.tag('GeneralGetError', e => InternalServerError(e.message)),
          Match.exhaustive
        )
      ),
      Effect.map(BookDtoMapper.mapGetQueryResultToDto),
      runHttpPromise({
        onSuccess: result => reply.send(result),
        onError: e => reply.status(e.status).send(e.error)
      })
    )
  }

  return { handler, schema }
}
