import { Brand } from 'effect'

export type BookTitle = string & Brand.Brand<'BookTitle'>

export const BookTitle = Brand.refined<BookTitle>(
  title => Boolean(title) && title.trim().length > 3,
  _ => Brand.error('InvalidTitle')
)
