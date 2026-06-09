export type DbBookStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'UNKNOWN'

export interface DbBook {
  id: string
  version: number
  dateCreated: Date
  dateModified: Date
  title: string
  description: string | null
  status: string
  authorUserId: string
}
