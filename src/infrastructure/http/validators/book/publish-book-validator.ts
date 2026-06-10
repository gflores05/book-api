import { Type, type Static } from 'typebox'

export const PublishBookRequest = Type.Object({
  id: Type.String({ format: 'uuid' }),
  actorUserId: Type.String({ format: 'uuid' })
})

export type PublishBookRequestType = Static<typeof PublishBookRequest>

export const PublishBookResponse = Type.Object({
  id: Type.String({ format: 'uuid' })
})

export type PublishBookResponseType = Static<typeof PublishBookResponse>
