import type { ICommandHandler } from '@application/util'
import { BookStatus, type IBookRepository, BookId } from '@domain/book'
import type { UserId } from '@domain/external'
import { Effect, Option, Data } from 'effect'
import type { IBookPolicies } from '../policies/book-policies'

export interface PublishBookCommand {
  id: BookId
  actorUserId: UserId
}

export function PublishBookCommand(
  id: BookId,
  actorUserId: UserId
): PublishBookCommand {
  return {
    id,
    actorUserId
  }
}

export interface PublishBookResult {
  id: BookId
}

export class BookNotExistPublishError extends Data.TaggedError(
  'BookNotExistPublishError'
)<{
  id: BookId
}> {}

export class InvalidBookStatusPublishError extends Data.TaggedError(
  'InvalidBookStatusPublishError'
)<{
  id: BookId
  status: BookStatus
}> {}

export class DeniedPublishError extends Data.TaggedError('DeniedPublishError')<{
  id: BookId
  actorUserId: UserId
}> {}

export class GeneralPublishError extends Data.TaggedError(
  'GeneralPublishError'
)<{
  message: string
}> {}

export type PublishBookError =
  | BookNotExistPublishError
  | DeniedPublishError
  | InvalidBookStatusPublishError
  | GeneralPublishError

export function createPublishBookCommandHandler(
  bookRepository: IBookRepository,
  bookPolicies: IBookPolicies
): ICommandHandler<PublishBookCommand, PublishBookResult, PublishBookError> {
  return {
    handle
  }

  function handle({
    id,
    actorUserId
  }: PublishBookCommand): Effect.Effect<PublishBookResult, PublishBookError> {
    return Effect.gen(function* () {
      const book = yield* bookRepository.get(id).pipe(
        Effect.mapError(
          _ => new GeneralPublishError({ message: 'Error getting book' })
        ),
        Effect.flatMap(ob =>
          ob.pipe(
            Option.match({
              onSome: b => Effect.succeed(b),
              onNone: () => Effect.fail(new BookNotExistPublishError({ id }))
            })
          )
        )
      )

      if (!bookPolicies.canUpdate(book, actorUserId)) {
        return yield* new DeniedPublishError({ id, actorUserId })
      }

      yield* book
        .publish()
        .pipe(
          Effect.mapError(
            _ => new InvalidBookStatusPublishError({ id, status: book.status })
          )
        )

      yield* bookRepository
        .save(book)
        .pipe(Effect.mapError(e => new GeneralPublishError(e)))

      return {
        id: book.id
      }
    })
  }
}
