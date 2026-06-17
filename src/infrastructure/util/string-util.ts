import { NonEmptyString } from '@domain/shared'
import { DateTime, Match, Option } from 'effect'

export function encodeBase64(value: string) {
  return Buffer.from(value, 'utf8').toString('base64')
}

export function decodeBase64(base64String: string) {
  return Buffer.from(base64String, 'base64').toString('utf8')
}

export const safeToString = Match.type<
  string | number | DateTime.DateTime | Option.Option<NonEmptyString>
>().pipe(
  Match.withReturnType<string>(),
  Match.when(Match.number, n => n.toFixed(2)),
  Match.when(Match.string, s => s),
  Match.when(DateTime.isDateTime, d => d.pipe(DateTime.formatIso)),
  Match.when(
    Option.isOption,
    o =>
      o.pipe(
        Option.map(nes => nes.toString()),
        Option.getOrUndefined
      ) || ''
  ),
  Match.exhaustive
)
