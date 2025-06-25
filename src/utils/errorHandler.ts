export class AdminError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AdminError'
  }
}

export const handleApiError = (error: any): AdminError => {
  if (error.response?.status === 403) {
    return new AdminError('Permissão negada', 'FORBIDDEN', 403)
  }
  if (error.response?.status === 404) {
    return new AdminError('Recurso não encontrado', 'NOT_FOUND', 404)
  }
  if (error.response?.status === 409) {
    return new AdminError('Conflito de dados', 'CONFLICT', 409)
  }
  return new AdminError('Erro interno do servidor', 'INTERNAL_ERROR', 500)
}

