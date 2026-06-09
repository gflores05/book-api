import { Book, BookId, BookStatus, BookTitle } from '@domain/book'
import { UserId } from '@domain/external'
import { NonEmptyString } from '@domain/shared'
import type { DbBook } from '@infrastructure/models'
import { DateTime, Option, Match } from 'effect'

export const BookMapper = {
  mapDbToDomain: (dbBook: DbBook) =>
    Book.reconsitute({
      id: BookId(dbBook.id),
      version: dbBook.version,
      dateCreated: DateTime.unsafeMake(dbBook.dateCreated),
      dateModified: DateTime.unsafeMake(dbBook.dateModified),
      title: BookTitle(dbBook.title),
      description: Option.fromNullable(dbBook.description).pipe(
        Option.map(val => NonEmptyString(val))
      ),
      status: Match.value(dbBook.status).pipe(
        Match.when('DRAFT', _ => BookStatus.Draft),
        Match.when('PUBLISHED', _ => BookStatus.Published),
        Match.when('ARCHIVED', _ => BookStatus.Archived),
        Match.orElse(() => BookStatus.Unknown)
      ),
      authorUserId: UserId(dbBook.authorUserId)
    }),
  mapDomainToDb: (book: Book): DbBook => ({
    id: book.id,
    version: book.version,
    dateCreated: book.dateCreated.pipe(DateTime.toDate),
    dateModified: book.dateModified.pipe(DateTime.toDate),
    title: book.title,
    description: book.description.pipe(Option.getOrNull),
    status: Match.value(book.status).pipe(
      Match.when(BookStatus.Draft, _ => 'DRAFT'),
      Match.when(BookStatus.Published, _ => 'PUBLISHED'),
      Match.when(BookStatus.Archived, _ => 'ARCHIVED'),
      Match.orElse(() => 'UNKNOWN')
    ),
    authorUserId: book.authorUserId
  })
}
