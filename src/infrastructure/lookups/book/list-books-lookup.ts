import type {
  BookProjection,
  IListBooksLookup,
  ListBooksParams
} from '@application/book'
import type { Page, PageOptions } from '@application/util'
import { DatabaseError } from '@domain/book'
import type { Database } from '@infrastructure/config'
import { BookMapper } from '@infrastructure/mappers'
import { booksTable } from '@infrastructure/persistence'
import { decodeBase64, encodeBase64 } from '@infrastructure/util'
import { asc, desc, gt } from 'drizzle-orm'
import { Effect } from 'effect'
import { last } from 'lodash-es'

export function createListBooksLookup(db: Database): IListBooksLookup {
  return {
    list
  }

  function list(
    opts: PageOptions<BookProjection, ListBooksParams>
  ): Effect.Effect<Page<BookProjection>, DatabaseError> {
    const orderByColumn = booksTable[opts.orderBy]
    const orderBy =
      opts.orderDirection === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

    return Effect.gen(function* () {
      const [items, total] = yield* Effect.all([
        Effect.tryPromise({
          try: () =>
            db
              .select()
              .from(booksTable)
              .where(
                opts.cursor
                  ? gt(orderByColumn, decodeBase64(opts.cursor))
                  : undefined
              )
              .orderBy(orderBy)
              .limit(opts.size),
          catch: err => new DatabaseError({ message: (err as any).message })
        }).pipe(Effect.map(p => p.map(BookMapper.mapDbToProjection))),
        Effect.tryPromise({
          try: () => db.$count(booksTable),
          catch: err => new DatabaseError({ message: (err as any).message })
        })
      ])

      const lastItem = last(items)

      const cursor = lastItem
        ? encodeBase64(lastItem[opts.orderBy].toString())
        : undefined

      return {
        items,
        total,
        cursor
      }
    })
  }
}
