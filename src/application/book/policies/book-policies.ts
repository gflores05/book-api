import type { Book } from '@domain/book'
import type { UserId } from '@domain/external'

export interface IBookPolicies {
  canUpdate(book: Book, actorUserId: UserId): boolean
  canRead(book: Book, actorUserId: UserId): boolean
  canList(authorUserId: UserId, actorUserId: UserId): boolean
}

export function createBookPolicies(): IBookPolicies {
  return {
    canUpdate,
    canRead,
    canList
  }

  function canUpdate(book: Book, actorUserId: UserId) {
    return book.authorUserId === actorUserId
  }

  function canRead(book: Book, actorUserId: UserId) {
    return book.authorUserId === actorUserId
  }

  function canList(authorUserId: UserId, actorUserId: UserId) {
    return authorUserId === actorUserId
  }
}
