import type { Book, BookId, IBookRepository } from '@domain/book'
import type { Database } from '@infrastructure/config'
import { BookMapper } from '@infrastructure/mappers'
import {
  type IRepositoryWithUnitOfWork,
  type Transaction,
  booksTable
} from '@infrastructure/persistence'
import { eq } from 'drizzle-orm'
import { Effect, Option, pipe } from 'effect'

export type IBookRepositoryWithUnitOfWork = IBookRepository &
  IRepositoryWithUnitOfWork

export function createBookRepository(
  db: Database
): IBookRepositoryWithUnitOfWork {
  return {
    get,
    save,
    forUnitOfWork
  }

  function get(id: BookId): Effect.Effect<Option.Option<Book>> {
    return pipe(
      Effect.promise(() =>
        db.select().from(booksTable).where(eq(booksTable.id, id))
      ),
      Effect.map(b =>
        b.length && b[0] ? BookMapper.mapDbToDomain(b[0]) : undefined
      ),
      Effect.map(b => Option.fromNullable(b))
    )
  }

  function save(book: Book): Effect.Effect<void> {
    return Effect.gen(function* () {
      const dbBook = BookMapper.mapDomainToDb(book)
      if (book.version === 0) {
        book.incrementVersion()

        yield* Effect.promise(() =>
          db.insert(booksTable).values(dbBook).returning()
        )
      } else {
        book.incrementVersion()
        yield* Effect.promise(() =>
          db.update(booksTable).set(dbBook).where(eq(booksTable.id, dbBook.id))
        )
      }

      book.clearUncommitedEvents()

      // Logic to map uncommited events to pubsub events
    })
  }

  function forUnitOfWork(db: Transaction) {
    return createBookRepository(db)
  }
}
