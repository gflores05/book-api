import type {
  ListBooksError,
  ListBooksQuery,
  ListBooksResult
} from '@application/book'
import type { IQueryHandler } from '@application/util'
import {
  ListBookRequest,
  ListBookResponse,
  type ListBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import {
  buildGetSchema,
  EmptyProps,
  Forbidden,
  InternalServerError,
  runHttpPromise,
  type FastifyReplyTypeBox,
  type FastifyRequestTypeBox,
  type HttpErrorResponse
} from '@infrastructure/util'
import { Effect, Match } from 'effect'

export function createListBookRoute(
  listBookQueryHandler: IQueryHandler<
    ListBooksQuery,
    ListBooksResult,
    ListBooksError
  >
) {
  const schema = buildGetSchema(ListBookResponse, EmptyProps, ListBookRequest)

  const handler = async function (
    request: FastifyRequestTypeBox<typeof schema>,
    reply: FastifyReplyTypeBox<typeof schema>
  ): Promise<ListBookResponseType> {
    const query = BookDtoMapper.mapListDtoToQuery(request.query)

    return listBookQueryHandler.handle(query).pipe(
      Effect.mapError(
        Match.type<ListBooksError>().pipe(
          Match.withReturnType<HttpErrorResponse>(),
          Match.tag('DeniedListError', e => Forbidden(e.actorUserId)),
          Match.tag('GeneralListError', e => InternalServerError(e.message)),
          Match.exhaustive
        )
      ),
      Effect.map(BookDtoMapper.mapListQueryResultToDto),
      runHttpPromise({
        onSuccess: result => reply.send(result),
        onError: e => reply.status(e.status).send(e.error)
      })
    )
  }

  return { handler, schema }
}
