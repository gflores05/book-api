export type PageOptions<T, P> = {
  size: number
  orderBy: keyof T
  orderDirection: 'asc' | 'desc'
  cursor?: string | undefined
  params: P
}

export function PageOptions<T, P>(
  size: number,
  orderBy: keyof T,
  orderDirection: 'asc' | 'desc',
  params: P,
  cursor?: string
): PageOptions<T, P> {
  return {
    size,
    orderBy,
    orderDirection,
    cursor,
    params
  }
}

export type Page<T> = {
  items: T[]
  total: number
  cursor: string | undefined
}
