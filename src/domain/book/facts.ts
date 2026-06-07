import type { NonEmptyString } from '@domain/shared'
import type { Fact } from '@shared/fact'
import type { BookId, BookTitle } from './value-objects'
import type { Option } from 'effect'

export interface BookUpdated extends Fact<BookId> {
  type: 'BookUpdated'
  title: BookTitle
  description: Option.Option<NonEmptyString>
}

export interface BookArchived extends Fact<BookId> {
  type: 'BookArchived'
}

export interface BookPublished extends Fact<BookId> {
  type: 'BookPublished'
}

export type BookFact = BookUpdated | BookArchived | BookPublished
