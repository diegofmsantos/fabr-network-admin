import axios, { AxiosInstance, AxiosResponse } from 'axios'

function getAuthToken(): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('fabr_auth_token='))
    ?.split('=')[1]
}

export class BaseService {
  protected api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 0,
    })

    this.api.interceptors.request.use((config) => {
      const token = getAuthToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API Error:', error)

        if (error.response?.status === 401) {
          document.cookie = 'fabr_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          window.location.href = '/login'
          throw new Error('Sessão expirada, faça login novamente')
        }

        // O backend responde { error, details? } (ou { message }); prefere a mensagem real
        const mensagemServidor = error.response?.data?.error || error.response?.data?.message

        if (error.response?.status === 404) {
          throw new Error(mensagemServidor || 'Recurso não encontrado')
        }

        if (error.response?.status >= 500) {
          throw new Error(mensagemServidor || 'Erro interno do servidor')
        }

        if (mensagemServidor) {
          throw new Error(mensagemServidor)
        }

        throw new Error(error.message || 'Erro na requisição')
      }
    )
  }

  protected async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.api.get<T>(url, { params })
    return response.data
  }

  protected async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data)
    return response.data
  }

  protected async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data)
    return response.data
  }

  protected async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url)
    return response.data
  }

  protected async upload<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('arquivo', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const response = await this.api.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    return response.data
  }
}