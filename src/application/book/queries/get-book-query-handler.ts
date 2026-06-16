import type { IQueryHandler } from '@application/util'
import {
  BookStatus,
  type IBookRepository,
  BookId,
  BookTitle
} from '@domain/book'
import type { UserId } from '@domain/external'
import { Effect, Option, Data, DateTime } from 'effect'
import type { IBookPolicies } from '../policies/book-policies'
import type { NonEmptyString } from '@domain/shared'

export interface GetBookQuery {
  id: BookId
  actorUserId: UserId
}

export interface GetBookResult {
  id: BookId
  dateCreated: DateTime.DateTime
  dateModified: DateTime.DateTime
  title: BookTitle
  description: Option.Option<NonEmptyString>
  status: BookStatus
  authorUserId: UserId
}

export class BookNotExistGetError extends Data.TaggedError(
  'BookNotExistGetError'
)<{
  id: BookId
}> {}

export class DeniedGetError extends Data.TaggedError('DeniedGetError')<{
  id: BookId
  actorUserId: UserId
}> {}

export class GeneralGetError extends Data.TaggedError('GeneralGetError')<{
  message: string
}> {}

export type GetBookError =
  | BookNotExistGetError
  | DeniedGetError
  | GeneralGetError

export function createGetBookQueryHandler(
  bookRepository: IBookRepository,
  bookPolicies: IBookPolicies
): IQueryHandler<GetBookQuery, GetBookResult, GetBookError> {
  return {
    handle
  }

  function handle({
    id,
    actorUserId
  }: GetBookQuery): Effect.Effect<GetBookResult, GetBookError> {
    return Effect.gen(function* () {
      const book = yield* bookRepository.get(id).pipe(
        Effect.mapError(
          _ => new GeneralGetError({ message: 'Error getting book' })
        ),
        Effect.flatMap(ob =>
          ob.pipe(
            Option.match({
              onSome: b => Effect.succeed(b),
              onNone: () => Effect.fail(new BookNotExistGetError({ id }))
            })
          )
        )
      )

      if (!bookPolicies.canRead(book, actorUserId)) {
        return yield* new DeniedGetError({ id, actorUserId })
      }

      return {
        id: book.id,
        dateCreated: book.dateCreated,
        dateModified: book.dateModified,
        title: book.title,
        description: book.description,
        status: book.status,
        authorUserId: book.authorUserId
      }
    })
  }
}
