import { Brand } from 'effect'
import { validate as uuidValidate } from 'uuid'

export type BookId = string & Brand.Brand<'BookId'>

export const BookId = Brand.refined<BookId>(
  id => uuidValidate(id),
  _ => Brand.error('InvalidUUID')
)
