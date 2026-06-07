import type { UserId } from '@domain/external'
import type { NonEmptyString } from '@domain/shared'
import { AggregateRoot, Fact } from '@shared/index'
import { BookId, BookTitle } from './value-objects'
import type { BookFact } from './facts'
import {
  BookAlreadyArchivedError,
  BookNotInDraftError,
  type BookError
} from './error'
import { Effect, DateTime, Option } from 'effect'
import { v4 } from 'uuid'

enum BookStatus {
  Draft,
  Published,
  Archived
}

type CreateBookParams = {
  title: BookTitle
  description: Option.Option<NonEmptyString>
  authorUserId: UserId
}

type ReconstituteBookParams = {
  id: BookId
  version: number
  dateCreated: DateTime.DateTime
  dateModified: DateTime.DateTime
  title: BookTitle
  description: Option.Option<NonEmptyString>
  status: BookStatus
  authorUserId: UserId
}

export class Book extends AggregateRoot<BookId, BookFact> {
  private constructor(
    id: BookId,
    version: number,
    dateCreated: DateTime.DateTime,
    dateModified: DateTime.DateTime,
    private _title: BookTitle,
    private _description: Option.Option<NonEmptyString>,
    private _status: BookStatus,
    private _authorUserId: UserId
  ) {
    super(id, version, dateCreated, dateModified)
  }

  static create({ title, description, authorUserId }: CreateBookParams) {
    return new Book(
      BookId(v4()),
      0,
      DateTime.make(new Date()).pipe(Option.getOrThrow),
      DateTime.make(new Date()).pipe(Option.getOrThrow),
      title,
      description,
      BookStatus.Draft,
      authorUserId
    )
  }

  static reconsitute({
    id,
    version,
    dateCreated,
    dateModified,
    title,
    description,
    status,
    authorUserId
  }: ReconstituteBookParams) {
    return new Book(
      id,
      version,
      dateCreated,
      dateModified,
      title,
      description,
      status,
      authorUserId
    )
  }

  update(title: BookTitle, description: Option.Option<NonEmptyString>) {
    // If book isn't in draft we can only update the description
    if (this.status !== BookStatus.Draft) {
      return this.record({
        ...Fact.defaults(this.id),
        type: 'BookUpdated',
        title: this.title,
        description
      })
    }

    this.record({
      ...Fact.defaults(this.id),
      type: 'BookUpdated',
      title,
      description
    })
  }

  publish(): Effect.Effect<void, BookError> {
    return Effect.gen(this, function* (this) {
      if (this.status !== BookStatus.Draft) {
        yield* new BookNotInDraftError({ id: this.id })
      }

      this.record({
        ...Fact.defaults(this.id),
        type: 'BookPublished'
      })
    })
  }

  archive(): Effect.Effect<void, BookError> {
    return Effect.gen(this, function* (this) {
      if (this.status === BookStatus.Archived) {
        yield* new BookAlreadyArchivedError({ id: this.id })
      }

      this.record({
        ...Fact.defaults(this.id),
        type: 'BookArchived'
      })
    })
  }

  get title() {
    return this._title
  }

  get description() {
    return this._description
  }

  get status() {
    return this._status
  }

  get authorUserId() {
    return this._authorUserId
  }

  protected apply(fact: BookFact) {
    switch (fact.type) {
      case 'BookUpdated':
        this._title = fact.title
        this._description = fact.description
        this._dateModified = fact.dateOccurred
        break
      case 'BookPublished':
        this._status = BookStatus.Published
        this._dateModified = fact.dateOccurred
        break
      case 'BookArchived':
        this._status = BookStatus.Archived
        this._dateModified = fact.dateOccurred
        break
    }
  }
}
