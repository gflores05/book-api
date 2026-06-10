import type { PageOptions, Page } from '@application/util'
import type { BookStatus, BookId, BookTitle } from '@domain/book'
import type { UserId } from '@domain/external'
import type { DateTime, Effect, Option } from 'effect'
import type { NonEmptyString } from 'effect/Schema'

export interface BookProjection {
  id: BookId
  dateCreated: DateTime.DateTime
  dateModified: DateTime.DateTime
  title: BookTitle
  description: Option.Option<NonEmptyString>
  status: BookStatus
  authorUserId: UserId
}

export interface ListBooksParams {
  authorUserId: UserId
}

export interface IListBooksLookup {
  list(
    opts: PageOptions<BookProjection, ListBooksParams>
  ): Effect.Effect<Page<BookProjection>>
}
