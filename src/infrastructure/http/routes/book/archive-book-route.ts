import type {
  ArchiveBookCommand,
  ArchiveBookResult,
  ArchiveBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  ArchiveBookRequest,
  ArchiveBookResponse,
  type ArchiveBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import {
  buildSchema,
  EmptyProps,
  Forbidden,
  InternalServerError,
  NotFound,
  PreconditionFailed,
  runHttpPromise,
  type FastifyReplyTypeBox,
  type FastifyRequestTypeBox,
  type HttpErrorResponse
} from '@infrastructure/util'
import { Effect, Match } from 'effect'

export function createArchiveBookRoute(
  archiveBookCommandHandler: ICommandHandler<
    ArchiveBookCommand,
    ArchiveBookResult,
    ArchiveBookError
  >
) {
  const schema = buildSchema(
    ArchiveBookRequest,
    ArchiveBookResponse,
    EmptyProps
  )

  const handler = async function (
    request: FastifyRequestTypeBox<typeof schema>,
    reply: FastifyReplyTypeBox<typeof schema>
  ): Promise<ArchiveBookResponseType> {
    const command = BookDtoMapper.mapArchiveDtoToCommand(request.body)

    return archiveBookCommandHandler.handle(command).pipe(
      Effect.mapError(
        Match.type<ArchiveBookError>().pipe(
          Match.withReturnType<HttpErrorResponse>(),
          Match.tag('BookNotExistArchiveError', e => NotFound('book', e.id)),
          Match.tag('InvalidBookStatusArchiveError', e =>
            PreconditionFailed('Book already archive')
          ),
          Match.tag('DeniedArchiveError', e => Forbidden(e.actorUserId)),
          Match.tag('GeneralArchiveError', e => InternalServerError(e.message)),
          Match.exhaustive
        )
      ),
      Effect.map(BookDtoMapper.mapArchiveCommandResultToDto),
      runHttpPromise({
        onSuccess: result => reply.send(result),
        onError: e => reply.status(e.status).send(e.error)
      })
    )
  }

  return { handler, schema }
}
