import type { ICommandHandler } from '@application/util'
import { type IBookRepository, BookId, type BookTitle } from '@domain/book'
import type { UserId } from '@domain/external'
import type { NonEmptyString } from '@domain/shared'
import { Effect, Option, Data } from 'effect'
import type { IBookPolicies } from '../policies/book-policies'

export interface UpdateBookCommand {
  id: BookId
  title: BookTitle
  description: Option.Option<NonEmptyString>
  actorUserId: UserId
}

export function UpdateBookCommand(
  id: BookId,
  title: BookTitle,
  description: Option.Option<NonEmptyString>,
  actorUserId: UserId
): UpdateBookCommand {
  return {
    id,
    title,
    description,
    actorUserId
  }
}

export interface UpdateBookResult {
  id: BookId
}

export class BookNotExistUpdateError extends Data.TaggedError(
  'BookNotExistUpdateError'
)<{
  id: BookId
}> {}

export class DeniedUpdateError extends Data.TaggedError('DeniedUpdateError')<{
  id: BookId
  actorUserId: UserId
}> {}

export class GeneralUpdateError extends Data.TaggedClass('GeneralUpdateError')<{
  message: string
}> {}

export type UpdateBookError =
  | BookNotExistUpdateError
  | DeniedUpdateError
  | GeneralUpdateError

export function createUpdateBookCommandHandler(
  bookRepository: IBookRepository,
  bookPolicies: IBookPolicies
): ICommandHandler<UpdateBookCommand, UpdateBookResult, UpdateBookError> {
  return {
    handle
  }

  function handle({
    id,
    title,
    description,
    actorUserId
  }: UpdateBookCommand): Effect.Effect<UpdateBookResult, UpdateBookError> {
    return Effect.gen(function* () {
      const book = yield* bookRepository.get(id).pipe(
        Effect.flatMap(ob =>
          ob.pipe(
            Option.match({
              onSome: b => Effect.succeed(b),
              onNone: () => Effect.fail(new BookNotExistUpdateError({ id }))
            })
          )
        )
      )

      if (!bookPolicies.canUpdate(book, actorUserId)) {
        return yield* new DeniedUpdateError({ id, actorUserId })
      }

      book.update(title, description)

      yield* bookRepository
        .save(book)
        .pipe(Effect.mapError(e => new GeneralUpdateError(e)))

      return {
        id: book.id
      }
    })
  }
}
