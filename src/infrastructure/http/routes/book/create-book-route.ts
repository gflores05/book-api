import type {
  CreateBookCommand,
  CreateBookResult,
  CreateBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  type CreateBookRequestType,
  type CreateBookResponseType,
  CreateBookRequest,
  CreateBookResponse
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import { buildOptions } from '@infrastructure/util'
import { Effect } from 'effect'
import type { FastifyRequest } from 'fastify'

export function createCreateBookRoute(
  createBookCommandHandler: ICommandHandler<
    CreateBookCommand,
    CreateBookResult,
    CreateBookError
  >
) {
  const handler = async function (
    request: FastifyRequest<{ Body: CreateBookRequestType }>
  ): Promise<CreateBookResponseType> {
    const command = BookDtoMapper.mapCreateDtoToCommand(request.body)

    return createBookCommandHandler
      .handle(command)
      .pipe(Effect.runPromise)
      .then(BookDtoMapper.mapCreateCommandResultToDto)
  }

  const opts = buildOptions(CreateBookRequest, {
    200: CreateBookResponse
  })

  return { handler, opts }
}
