import { Type, type Static } from 'typebox'

export const UpdateBookRequest = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  actorUserId: Type.String({ format: 'uuid' })
})

export type UpdateBookRequestType = Static<typeof UpdateBookRequest>

export const UpdateBookResponse = Type.Object({
  id: Type.String({ format: 'uuid' })
})

export type UpdateBookResponseType = Static<typeof UpdateBookResponse>
