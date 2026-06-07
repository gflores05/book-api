import { Brand } from 'effect'

export type NonEmptyString = string & Brand.Brand<'NonEmptyString'>

export const NonEmptyString = Brand.refined<NonEmptyString>(
  title => Boolean(title) && title.trim().length > 0,
  _ => Brand.error('EmptyString')
)
