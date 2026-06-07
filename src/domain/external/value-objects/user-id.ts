import { Brand } from 'effect'
import { validate as uuidValidate } from 'uuid'

export type UserId = string & Brand.Brand<'UserId'>

export const UserId = Brand.refined<UserId>(
  id => uuidValidate(id),
  _ => Brand.error('InvalidUUID')
)
