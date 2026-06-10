import type {
  ArchiveBookCommand,
  ArchiveBookResult,
  ArchiveBookError
} from '@application/book'
import type { ICommandHandler } from '@application/util'
import {
  type ArchiveBookRequestType,
  ArchiveBookRequest,
  ArchiveBookResponse,
  type ArchiveBookResponseType
} from '@infrastructure/http'
import { BookDtoMapper } from '@infrastructure/mappers'
import { buildOptions } from '@infrastructure/util'
import { Effect } from 'effect'
import type { FastifyRequest } from 'fastify'

export function createArchiveBookRoute(
  archiveBookCommandHandler: ICommandHandler<
    ArchiveBookCommand,
    ArchiveBookResult,
    ArchiveBookError
  >
) {
  const handler = async function (
    request: FastifyRequest<{ Body: ArchiveBookRequestType }>
  ): Promise<ArchiveBookResponseType> {
    const command = BookDtoMapper.mapArchiveDtoToCommand(request.body)

    return archiveBookCommandHandler
      .handle(command)
      .pipe(Effect.runPromise)
      .then(BookDtoMapper.mapArchiveCommandResultToDto)
  }

  const opts = buildOptions(ArchiveBookRequest, {
    200: ArchiveBookResponse
  })

  return { handler, opts }
}
