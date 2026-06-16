import type { Book } from './book'
import type { BookId } from './value-objects'
import { Effect, Option, Data } from 'effect'

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  message: string
}> {}

export interface IBookRepository {
  get(id: BookId): Effect.Effect<Option.Option<Book>, DatabaseError>
  save(book: Book): Effect.Effect<void, DatabaseError>
}
