import {
  pgTable,
  uuid,
  timestamp,
  integer,
  varchar,
  text
} from 'drizzle-orm/pg-core'

export const booksTable = pgTable('book', {
  id: uuid().primaryKey().defaultRandom(),
  version: integer().notNull(),
  dateCreated: timestamp({ precision: 6, withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  dateModified: timestamp({ precision: 6, withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  title: varchar().notNull(),
  description: text(),
  status: varchar({ length: 100 }).notNull(),
  authorUserId: uuid().notNull()
})
