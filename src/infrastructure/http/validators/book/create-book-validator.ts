import { Type, type Static } from 'typebox'

export const CreateBookRequest = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  authorUserId: Type.String()
})

export type CreateBookRequestType = Static<typeof CreateBookRequest>

export const CreateBookResponse = Type.Object({
  id: Type.String({ format: 'uuid' })
})

export type CreateBookResponseType = Static<typeof CreateBookResponse>
