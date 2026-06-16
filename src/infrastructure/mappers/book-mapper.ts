import {
  ArchiveBookCommand,
  CreateBookCommand,
  PublishBookCommand,
  UpdateBookCommand,
  type ArchiveBookResult,
  type BookProjection,
  type CreateBookResult,
  type GetBookResult,
  type PublishBookResult,
  type UpdateBookResult
} from '@application/book'
import { Book, BookId, BookStatus, BookTitle } from '@domain/book'
import { UserId } from '@domain/external'
import { NonEmptyString } from '@domain/shared'
import type {
  ArchiveBookRequestType,
  ArchiveBookResponseType,
  CreateBookRequestType,
  CreateBookResponseType,
  GetBookRequestType,
  GetBookResponseType,
  PublishBookRequestType,
  PublishBookResponseType,
  UpdateBookRequestType,
  UpdateBookResponseType
} from '@infrastructure/http'
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
  mapDbToProjection: (dbBook: DbBook): BookProjection => ({
    id: BookId(dbBook.id),
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

export const BookDtoMapper = {
  mapCreateDtoToCommand(createBookDto: CreateBookRequestType) {
    return CreateBookCommand(
      BookTitle(createBookDto.title),
      Option.fromNullable(createBookDto.description).pipe(
        Option.map(d => NonEmptyString(d))
      ),
      UserId(createBookDto.authorUserId)
    )
  },

  mapCreateCommandResultToDto(
    createBookCommandResult: CreateBookResult
  ): CreateBookResponseType {
    return {
      id: createBookCommandResult.id
    }
  },

  mapUpdateDtoToCommand(updateBookDto: UpdateBookRequestType) {
    return UpdateBookCommand(
      BookId(updateBookDto.id),
      BookTitle(updateBookDto.title),
      Option.fromNullable(updateBookDto.description).pipe(
        Option.map(d => NonEmptyString(d))
      ),
      UserId(updateBookDto.actorUserId)
    )
  },

  mapUpdateCommandResultToDto(
    updateBookCommandResult: UpdateBookResult
  ): UpdateBookResponseType {
    return {
      id: updateBookCommandResult.id
    }
  },

  mapPublishDtoToCommand(pubishBookDto: PublishBookRequestType) {
    return PublishBookCommand(
      BookId(pubishBookDto.id),
      UserId(pubishBookDto.actorUserId)
    )
  },

  mapPublishCommandResultToDto(
    publishBookCommandResult: PublishBookResult
  ): PublishBookResponseType {
    return {
      id: publishBookCommandResult.id
    }
  },

  mapArchiveDtoToCommand(archiveBookDto: ArchiveBookRequestType) {
    return ArchiveBookCommand(
      BookId(archiveBookDto.id),
      UserId(archiveBookDto.actorUserId)
    )
  },

  mapArchiveCommandResultToDto(
    archiveBookCommandResult: ArchiveBookResult
  ): ArchiveBookResponseType {
    return {
      id: archiveBookCommandResult.id
    }
  },

  mapGetDtoToQuery(getBookDto: GetBookRequestType) {
    return ArchiveBookCommand(
      BookId(getBookDto.id),
      UserId(getBookDto.actorUserId)
    )
  },

  mapGetQueryResultToDto(
    getBookQueryResult: GetBookResult
  ): GetBookResponseType {
    return {
      id: getBookQueryResult.id,
      dateCreated: getBookQueryResult.dateCreated.pipe(DateTime.formatUtc),
      dateModified: getBookQueryResult.dateModified.pipe(DateTime.formatUtc),
      title: getBookQueryResult.title,
      description:
        getBookQueryResult.description.pipe(Option.getOrUndefined) || '',
      status: Match.value(getBookQueryResult.status).pipe(
        Match.when(BookStatus.Draft, _ => 'Draft'),
        Match.when(BookStatus.Published, _ => 'Published'),
        Match.when(BookStatus.Archived, _ => 'Archived'),
        Match.orElse(() => 'Unknown')
      ),
      authorUserId: getBookQueryResult.authorUserId
    }
  }
}
