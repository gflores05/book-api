import { validate as uuidValidate, v4 } from 'uuid'
import { Brand, DateTime, Option } from 'effect'

export type FactId = string & Brand.Brand<'FactId'>

export const FactId = Brand.refined<FactId>(
  id => uuidValidate(id),
  _ => Brand.error('InvalidUUID')
)

export interface Fact<T> {
  readonly type: string
  readonly id: FactId
  readonly dateOccurred: DateTime.DateTime
  readonly aggregateId: T
}

export const Fact = {
  defaults: <T>(
    aggregateId: T
  ): Pick<Fact<T>, 'id' | 'dateOccurred' | 'aggregateId'> => {
    return {
      id: FactId(v4()),
      dateOccurred: DateTime.make(new Date()).pipe(Option.getOrThrow),
      aggregateId
    }
  }
}
