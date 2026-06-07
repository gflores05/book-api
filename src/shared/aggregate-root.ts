import type { Fact } from './fact'
import { DateTime } from 'effect'

export abstract class AggregateRoot<T, F extends Fact<T>> {
  private uncommitedEvents: F[] = []

  protected constructor(
    private _id: T,
    private _version: number,
    protected _dateCreated: DateTime.DateTime,
    protected _dateModified: DateTime.DateTime
  ) {}

  get id() {
    return this._id
  }

  get version() {
    return this._version
  }

  get dateCreated() {
    return this._dateCreated
  }

  get dateModified() {
    return this._dateModified
  }

  protected record(fact: F) {
    this.apply(fact)
    this.uncommitedEvents.push(fact)
  }

  protected abstract apply(fact: F): void
}
