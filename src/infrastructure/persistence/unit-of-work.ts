import type { Database } from '@infrastructure/config'
import { Effect } from 'effect'

export type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0]

export interface IRepositoryWithUnitOfWork {
  forUnitOfWork(db: Transaction): IRepositoryWithUnitOfWork
}

export interface IUnitOfWork {
  execute<T>(work: (tx: Transaction) => Effect.Effect<T>): Effect.Effect<T>
}

export function createUnitOfWork(db: Database): IUnitOfWork {
  return {
    execute
  }

  function execute<T>(work: (tx: Transaction) => Effect.Effect<T>) {
    return Effect.gen(function* () {
      return yield* Effect.promise(() =>
        db.transaction(async tx => {
          return work(tx)
        })
      ).pipe(Effect.flatMap(r => r))
    })
  }
}
