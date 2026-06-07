import type { Book } from './book'
import type { BookId } from './value-objects'
import { Effect } from 'effect'

export interface IBookRepository {
  get(id: BookId): Effect.Effect<Book>
  save(book: Book): Effect.Effect<void>
}
