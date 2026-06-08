import type { IQueryHandler, Page, PageOptions } from '@application/util'
import type { UserId } from '@domain/external'
import { Effect, Data } from 'effect'
import type { IBookPolicies } from '../policies/book-policies'
import type {
  BookProjection,
  IListBooksLookup,
  ListBooksParams
} from '../lookup/list-books-lookup'

export interface ListBooksQuery {
  pageOptions: PageOptions<BookProjection, ListBooksParams>
  actorUserId: UserId
}

export type ListBooksResult = Page<BookProjection>

export class DeniedListError extends Data.TaggedError('DeniedListError')<{
  actorUserId: UserId
}> {}

type ListBooksError = DeniedListError

export function createGetBookQueryHandler(
  listBooksLookup: IListBooksLookup,
  bookPolicies: IBookPolicies
): IQueryHandler<ListBooksQuery, ListBooksResult, ListBooksError> {
  return {
    handle
  }

  function handle({
    pageOptions,
    actorUserId
  }: ListBooksQuery): Effect.Effect<ListBooksResult, ListBooksError> {
    return Effect.gen(function* () {
      if (!bookPolicies.canList(pageOptions.params.authorUserId, actorUserId)) {
        return yield* new DeniedListError({ actorUserId })
      }

      return yield* listBooksLookup.list(pageOptions)
    })
  }
}
