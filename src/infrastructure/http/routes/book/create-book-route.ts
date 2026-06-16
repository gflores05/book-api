import type {
  CreateBookCommand,
  CreateBookResult,
  CreateBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import { CreateBookRequest, CreateBookResponse } from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import {
  buildSchema,
  EmptyProps,
  InternalServerError,
  runHttpPromise,
  type FastifyReplyTypeBox,
  type FastifyRequestTypeBox,
  type HttpErrorResponse
} from '@infrastructure/util'
import { Effect, Match } from 'effect'

export function createCreateBookRoute(
  createBookCommandHandler: ICommandHandler<
    CreateBookCommand,
    CreateBookResult,
    CreateBookError
  >
) {
  const schema = buildSchema(CreateBookRequest, CreateBookResponse, EmptyProps)

  const handler = async function (
    request: FastifyRequestTypeBox<typeof schema>,
    reply: FastifyReplyTypeBox<typeof schema>
  ) {
    console.log()
    const command = BookDtoMapper.mapCreateDtoToCommand(request.body)

    return createBookCommandHandler.handle(command).pipe(
      Effect.mapError(
        Match.type<CreateBookError>().pipe(
          Match.withReturnType<HttpErrorResponse>(),
          Match.tag('CreateBookError', () =>
            InternalServerError('Error creating book')
          ),
          Match.exhaustive
        )
      ),
      Effect.map(BookDtoMapper.mapCreateCommandResultToDto),
      runHttpPromise({
        onSuccess: result => reply.send(result),
        onError: e => reply.status(e.status).send(e.error)
      })
    )
  }

  return { handler, schema }
}
