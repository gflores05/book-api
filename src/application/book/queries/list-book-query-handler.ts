import type { IQueryHandler, Page, PageOptions } from '@application/util'
import type { UserId } from '@domain/external'
import { Effect, Data } from 'effect'
import type { IBookPolicies } from '../policies/book-policies'
import type {
  BookProjection,
  IListBooksLookup,
  ListBooksParams
} from '../lookups/list-books-lookup'

export type ListBooksQuery = {
  pageOptions: PageOptions<BookProjection, ListBooksParams>
  actorUserId: UserId
}

export function ListBookQuery(
  pageOptions: PageOptions<BookProjection, ListBooksParams>,
  actorUserId: UserId
): ListBooksQuery {
  return { pageOptions, actorUserId }
}

export type ListBooksResult = Page<BookProjection>

export class GeneralListError extends Data.TaggedError('GeneralListError')<{
  message: string
}> {}

export class DeniedListError extends Data.TaggedError('DeniedListError')<{
  actorUserId: UserId
}> {}

export type ListBooksError = DeniedListError | GeneralListError

export function createListBookQueryHandler(
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

      return yield* listBooksLookup
        .list(pageOptions)
        .pipe(
          Effect.mapError(
            _ => new GeneralListError({ message: 'Error reading the books' })
          )
        )
    })
  }
}
