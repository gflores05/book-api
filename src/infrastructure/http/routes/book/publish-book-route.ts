import type {
  PublishBookCommand,
  PublishBookResult,
  PublishBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  type PublishBookRequestType,
  PublishBookRequest,
  PublishBookResponse,
  type PublishBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import { buildOptions } from '@infrastructure/util'
import { Effect } from 'effect'
import type { FastifyRequest } from 'fastify'

export function createPublishBookRoute(
  publishBookCommandHandler: ICommandHandler<
    PublishBookCommand,
    PublishBookResult,
    PublishBookError
  >
) {
  const handler = async function (
    request: FastifyRequest<{ Body: PublishBookRequestType }>
  ): Promise<PublishBookResponseType> {
    const command = BookDtoMapper.mapPublishDtoToCommand(request.body)

    return publishBookCommandHandler
      .handle(command)
      .pipe(Effect.runPromise)
      .then(BookDtoMapper.mapPublishCommandResultToDto)
  }

  const opts = buildOptions(PublishBookRequest, {
    200: PublishBookResponse
  })

  return { handler, opts }
}
