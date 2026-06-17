import { Type, type Static } from 'typebox'

export const ListBookRequest = Type.Object({
  size: Type.Integer({ minimum: 1, maximum: 100 }),
  orderBy: Type.String({
    enum: [
      'id',
      'dateCreated',
      'dateModified',
      'title',
      'description',
      'authorUserId',
      'status'
    ]
  }),
  orderDirection: Type.String({ enum: ['asc', 'desc'] }),
  cursor: Type.Optional(Type.String({})),
  authorUserId: Type.String({ format: 'uuid' }),
  actorUserId: Type.String({ format: 'uuid' })
})

export type ListBookRequestType = Static<typeof ListBookRequest>

export const ListBookResponse = Type.Object({
  total: Type.Integer({}),
  cursor: Type.Optional(Type.String({})),
  items: Type.Array(
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      dateCreated: Type.String({ format: 'date-time' }),
      dateModified: Type.String({ format: 'date-time' }),
      title: Type.String(),
      description: Type.Optional(Type.String()),
      status: Type.String({
        enum: ['Draft', 'Published', 'Archived', 'Unknown']
      }),
      authorUserId: Type.String({ format: 'uuid' })
    })
  )
})

export type ListBookResponseType = Static<typeof ListBookResponse>
