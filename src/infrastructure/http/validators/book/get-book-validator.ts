import { Type, type Static } from 'typebox'

export const GetBookRequest = Type.Object({
  id: Type.String({ format: 'uuid' }),
  actorUserId: Type.String({ format: 'uuid' })
})

export type GetBookRequestType = Static<typeof GetBookRequest>

export const GetBookResponse = Type.Object({
  id: Type.String({ format: 'uuid' }),
  dateCreated: Type.String({}),
  dateModified: Type.String({ format: 'date-time' }),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  status: Type.String({ enum: ['Draft', 'Published', 'Archived', 'Unknown'] }),
  authorUserId: Type.String({ format: 'uuid' })
})

export type GetBookResponseType = Static<typeof GetBookResponse>
