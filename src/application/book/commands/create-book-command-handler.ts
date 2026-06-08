import type { ICommandHandler } from '@application/util'
import {
  Book,
  type IBookRepository,
  BookId,
  type BookTitle
} from '@domain/book'
import type { UserId } from '@domain/external'
import type { NonEmptyString } from '@domain/shared'
import { Effect, Option, Data } from 'effect'

export interface CreateBookCommand {
  title: BookTitle
  description: Option.Option<NonEmptyString>
  authorUserId: UserId
}

export interface CreateBookResult {
  id: BookId
}

export class CreateBookError extends Data.TaggedError('CreateBookError')<{}> {}

export function createCreateBookCommandHandler(
  bookRepository: IBookRepository
): ICommandHandler<CreateBookCommand, CreateBookResult, CreateBookError> {
  return {
    handle
  }

  function handle({
    title,
    description,
    authorUserId
  }: CreateBookCommand): Effect.Effect<CreateBookResult, CreateBookError> {
    return Effect.gen(function* () {
      const book = Book.create({
        title,
        description,
        authorUserId
      })

      yield* bookRepository.save(book)

      return {
        id: book.id
      }
    })
  }
}
