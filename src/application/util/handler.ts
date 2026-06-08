import type { Effect } from 'effect'

export interface ICommandHandler<C, R, E> {
  handle: (command: C) => Effect.Effect<R, E>
}

export interface IQueryHandler<Q, R, E> {
  handle: (command: Q) => Effect.Effect<R, E>
}
