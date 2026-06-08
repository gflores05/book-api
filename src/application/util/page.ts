export type PageOptions<T, P> = {
  size: number
  orderBy: keyof T
  nextToken: string
  params: P
}

export type Page<T> = {
  items: T[]
  total: number
  netxToken: string
}
