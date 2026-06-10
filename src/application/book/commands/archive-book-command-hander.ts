import type { ICommandHandler } from '@application/util'
import { BookStatus, type IBookRepository, BookId } from '@domain/book'
import type { UserId } from '@domain/external'
import { Effect, Option, Data } from 'effect'
import type { IBookPolicies } from '../policies/book-policies'

export interface ArchiveBookCommand {
  id: BookId
  actorUserId: UserId
}

export function ArchiveBookCommand(
  id: BookId,
  actorUserId: UserId
): ArchiveBookCommand {
  return {
    id,
    actorUserId
  }
}

export interface ArchiveBookResult {
  id: BookId
}

export class BookNotExistArchiveError extends Data.TaggedError(
  'BookNotExistArchiveError'
)<{
  id: BookId
}> {}

export class InvalidBookStatusArchiveError extends Data.TaggedError(
  'InvalidBookStatusArchiveError'
)<{
  id: BookId
  status: BookStatus
}> {}

export class DeniedArchiveError extends Data.TaggedError('DeniedArchiveError')<{
  id: BookId
  actorUserId: UserId
}> {}

export class GeneralArchiveError extends Data.TaggedClass(
  'GeneralArchiveError'
)<{ message: string }> {}

export type ArchiveBookError =
  | BookNotExistArchiveError
  | DeniedArchiveError
  | InvalidBookStatusArchiveError
  | GeneralArchiveError

export function createArchiveBookCommandHandler(
  bookRepository: IBookRepository,
  bookPolicies: IBookPolicies
): ICommandHandler<ArchiveBookCommand, ArchiveBookResult, ArchiveBookError> {
  return {
    handle
  }

  function handle({
    id,
    actorUserId
  }: ArchiveBookCommand): Effect.Effect<ArchiveBookResult, ArchiveBookError> {
    return Effect.gen(function* () {
      const book = yield* bookRepository.get(id).pipe(
        Effect.flatMap(ob =>
          ob.pipe(
            Option.match({
              onSome: b => Effect.succeed(b),
              onNone: () => Effect.fail(new BookNotExistArchiveError({ id }))
            })
          )
        )
      )

      if (!bookPolicies.canUpdate(book, actorUserId)) {
        return yield* new DeniedArchiveError({ id, actorUserId })
      }

      yield* book
        .archive()
        .pipe(
          Effect.mapError(
            _ => new InvalidBookStatusArchiveError({ id, status: book.status })
          )
        )

      yield* bookRepository
        .save(book)
        .pipe(Effect.mapError(e => new GeneralArchiveError(e)))

      return {
        id: book.id
      }
    })
  }
}
