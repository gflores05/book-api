import type {
  UpdateBookCommand,
  UpdateBookResult,
  UpdateBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  UpdateBookRequest,
  UpdateBookResponse,
  type UpdateBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import {
  buildSchema,
  Forbidden,
  InternalServerError,
  NotFound,
  runHttpPromise,
  type FastifyReplyTypeBox,
  type FastifyRequestTypeBox,
  type HttpErrorResponse
} from '@infrastructure/util'
import { Effect, Match } from 'effect'

export function createUpdateBookRoute(
  updateBookCommandHandler: ICommandHandler<
    UpdateBookCommand,
    UpdateBookResult,
    UpdateBookError
  >
) {
  const schema = buildSchema(UpdateBookRequest, UpdateBookResponse)

  const handler = async function (
    request: FastifyRequestTypeBox<typeof schema>,
    reply: FastifyReplyTypeBox<typeof schema>
  ): Promise<UpdateBookResponseType> {
    const command = BookDtoMapper.mapUpdateDtoToCommand(request.body)

    return updateBookCommandHandler.handle(command).pipe(
      Effect.mapError(
        Match.type<UpdateBookError>().pipe(
          Match.withReturnType<HttpErrorResponse>(),
          Match.tag('BookNotExistUpdateError', e => NotFound('book', e.id)),
          Match.tag('DeniedUpdateError', e => Forbidden(e.actorUserId)),
          Match.tag('GeneralUpdateError', e => InternalServerError(e.message)),
          Match.exhaustive
        )
      ),
      Effect.map(BookDtoMapper.mapUpdateCommandResultToDto),
      runHttpPromise({
        onSuccess: result => reply.send(result),
        onError: e => reply.status(e.status).send(e.error)
      })
    )
  }

  return { handler, schema }
}
