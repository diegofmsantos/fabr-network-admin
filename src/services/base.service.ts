import axios, { AxiosInstance, AxiosResponse } from 'axios'

export class BaseService {
  protected api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 30000,
    })

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API Error:', error)
        
        if (error.response?.status === 404) {
          throw new Error('Recurso não encontrado')
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Erro interno do servidor')
        }
        
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message)
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