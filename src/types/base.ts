export interface BaseEntity {
  id: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface BaseFilters {
  temporada?: string
  page?: number
  limit?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}