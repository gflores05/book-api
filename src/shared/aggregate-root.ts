import type { Fact } from './fact'
import { DateTime } from 'effect'

export abstract class AggregateRoot<T, F extends Fact<T>> {
  private _uncommitedEvents: F[] = []

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

  get uncommitedEvents() {
    return [...this._uncommitedEvents]
  }

  incrementVersion() {
    this._version += 1
  }

  clearUncommitedEvents() {
    this._uncommitedEvents = []
  }

  protected record(fact: F) {
    this.apply(fact)
    this._uncommitedEvents.push(fact)
  }

  protected abstract apply(fact: F): void
}
