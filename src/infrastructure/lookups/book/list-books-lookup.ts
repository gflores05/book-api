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
import { decodeBase64, encodeBase64, safeToString } from '@infrastructure/util'
import { and, asc, desc, eq, gt } from 'drizzle-orm'
import { Effect, Match } from 'effect'
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
      const authorUserIdCond = eq(
        booksTable.authorUserId,
        opts.params.authorUserId
      )

      const [items, total] = yield* Effect.all([
        Effect.tryPromise({
          try: () =>
            db
              .select()
              .from(booksTable)
              .where(
                opts.cursor
                  ? and(
                      authorUserIdCond,
                      gt(
                        orderByColumn,
                        parseColumnValue(
                          opts.orderBy,
                          decodeBase64(opts.cursor)
                        )
                      )
                    )
                  : authorUserIdCond
              )
              .orderBy(orderBy)
              .limit(opts.size),
          catch: err => {
            console.error(err)
            return new DatabaseError({ message: (err as any).message })
          }
        }).pipe(Effect.map(p => p.map(BookMapper.mapDbToProjection))),
        Effect.tryPromise({
          try: () =>
            db.$count(
              booksTable,
              eq(booksTable.authorUserId, opts.params.authorUserId)
            ),
          catch: err => new DatabaseError({ message: (err as any).message })
        })
      ])

      const lastItem = last(items)

      const cursor = lastItem
        ? encodeBase64(safeToString(lastItem[opts.orderBy]))
        : undefined

      return {
        items,
        total,
        cursor
      }
    })
  }
}

function parseColumnValue(column: keyof BookProjection, value: string) {
  return Match.value(column).pipe(
    Match.when('dateCreated', () => new Date(value)),
    Match.when('dateModified', () => new Date(value)),
    Match.orElse(() => value)
  )
}
