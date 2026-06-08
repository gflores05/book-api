import type { Book } from './book'
import type { BookId } from './value-objects'
import { Effect, Option } from 'effect'

export interface IBookRepository {
  get(id: BookId): Effect.Effect<Option.Option<Book>>
  save(book: Book): Effect.Effect<void>
}
