export type PageOptions<T, P> = {
  size: number
  orderBy: keyof T
  orderDirection: 'asc' | 'desc'
  cursor?: string
  params: P
}

export type Page<T> = {
  items: T[]
  total: number
  cursor: string | undefined
}
