import type {
  PublishBookCommand,
  PublishBookResult,
  PublishBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  PublishBookRequest,
  PublishBookResponse,
  type PublishBookResponseType
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

export function createPublishBookRoute(
  publishBookCommandHandler: ICommandHandler<
    PublishBookCommand,
    PublishBookResult,
    PublishBookError
  >
) {
  const schema = buildSchema(
    PublishBookRequest,
    PublishBookResponse,
    EmptyProps
  )

  const handler = async function (
    request: FastifyRequestTypeBox<typeof schema>,
    reply: FastifyReplyTypeBox<typeof schema>
  ): Promise<PublishBookResponseType> {
    const command = BookDtoMapper.mapPublishDtoToCommand(request.body)

    return publishBookCommandHandler.handle(command).pipe(
      Effect.mapError(
        Match.type<PublishBookError>().pipe(
          Match.withReturnType<HttpErrorResponse>(),
          Match.tag('BookNotExistPublishError', e => NotFound('book', e.id)),
          Match.tag('InvalidBookStatusPublishError', e =>
            PreconditionFailed('Book already archive')
          ),
          Match.tag('DeniedPublishError', e => Forbidden(e.actorUserId)),
          Match.tag('GeneralPublishError', e => InternalServerError(e.message)),
          Match.exhaustive
        )
      ),
      Effect.map(BookDtoMapper.mapPublishCommandResultToDto),
      runHttpPromise({
        onSuccess: result => reply.send(result),
        onError: e => reply.status(e.status).send(e.error)
      })
    )
  }

  return { handler, schema }
}
