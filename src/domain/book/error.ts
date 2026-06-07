import type { BookId } from './value-objects'
import { Data } from 'effect'

export class BookNotInDraftError extends Data.TaggedError(
  'BookNotInDraftError'
)<{ id: BookId }> {}

export class BookAlreadyArchivedError extends Data.TaggedError(
  'BookAlreadyArchivedError'
)<{ id: BookId }> {}

export type BookError = BookNotInDraftError | BookAlreadyArchivedError
