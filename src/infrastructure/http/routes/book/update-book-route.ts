import type {
  UpdateBookCommand,
  UpdateBookResult,
  UpdateBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  type UpdateBookRequestType,
  UpdateBookRequest,
  UpdateBookResponse,
  type UpdateBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import { buildOptions } from '@infrastructure/util'
import { Effect } from 'effect'
import type { FastifyRequest } from 'fastify'

export function createUpdateBookRoute(
  updateBookCommandHandler: ICommandHandler<
    UpdateBookCommand,
    UpdateBookResult,
    UpdateBookError
  >
) {
  const handler = async function (
    request: FastifyRequest<{ Body: UpdateBookRequestType }>
  ): Promise<UpdateBookResponseType> {
    const command = BookDtoMapper.mapUpdateDtoToCommand(request.body)

    return updateBookCommandHandler
      .handle(command)
      .pipe(Effect.runPromise)
      .then(BookDtoMapper.mapUpdateCommandResultToDto)
  }

  const opts = buildOptions(UpdateBookRequest, {
    200: UpdateBookResponse
  })

  return { handler, opts }
}
