import { Type, type Static } from 'typebox'

export const ArchiveBookRequest = Type.Object({
  id: Type.String({ format: 'uuid' }),
  actorUserId: Type.String({ format: 'uuid' })
})

export type ArchiveBookRequestType = Static<typeof ArchiveBookRequest>

export const ArchiveBookResponse = Type.Object({
  id: Type.String({ format: 'uuid' })
})

export type ArchiveBookResponseType = Static<typeof ArchiveBookResponse>
