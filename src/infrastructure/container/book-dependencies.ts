import {
  createArchiveBookCommandHandler,
  createCreateBookCommandHandler,
  createPublishBookCommandHandler,
  createUpdateBookCommandHandler,
  createGetBookQueryHandler,
  createListBookQueryHandler,
  createBookPolicies
} from '@application/book'
import {
  createArchiveBookRoute,
  createBookRoutes,
  createCreateBookRoute,
  createGetBookRoute,
  createPublishBookRoute,
  createUpdateBookRoute,
  createListBookRoute
} from '@infrastructure/http'
import { createListBooksLookup } from '@infrastructure/lookups'
import { createBookRepository } from '@infrastructure/repositories'
import { asFunction, type AwilixContainer } from 'awilix'

export function registerBook(container: AwilixContainer) {
  container.register({
    // Commands
    archiveBookCommandHandler: asFunction(
      createArchiveBookCommandHandler
    ).scoped(),
    createBookCommandHandler: asFunction(
      createCreateBookCommandHandler
    ).scoped(),
    publishBookCommandHandler: asFunction(
      createPublishBookCommandHandler
    ).scoped(),
    updateBookCommandHandler: asFunction(
      createUpdateBookCommandHandler
    ).scoped(),

    // Queries
    getBookQueryHandler: asFunction(createGetBookQueryHandler).scoped(),
    listBookQueryHandler: asFunction(createListBookQueryHandler).scoped(),

    // Lookups
    listBooksLookup: asFunction(createListBooksLookup).scoped(),

    // Policies
    bookPolicies: asFunction(createBookPolicies).scoped(),

    // Repositories
    bookRepository: asFunction(createBookRepository).scoped(),

    // routes
    registerBookRoutes: asFunction(createBookRoutes).scoped(),
    createBookRoute: asFunction(createCreateBookRoute).scoped(),
    updateBookRoute: asFunction(createUpdateBookRoute).scoped(),
    publishBookRoute: asFunction(createPublishBookRoute).scoped(),
    archiveBookRoute: asFunction(createArchiveBookRoute).scoped(),
    getBookRoute: asFunction(createGetBookRoute).scoped(),
    listBooksRoute: asFunction(createListBookRoute).scoped()
  })
}
