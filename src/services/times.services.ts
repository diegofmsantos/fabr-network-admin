import { Time } from '@/types/time'
import { api } from '@/api/api'

export class TimesService {
  // Buscar times por temporada - usando sua API atual
  static async getTimes(temporada: string = '2025'): Promise<Time[]> {
    try {
      // Usando a mesma URL que você já usa
      const response = await api.get(`/times/times?temporada=${temporada}`)
      return response.data || []
    } catch (error) {
      console.error('Erro ao buscar times:', error)
      throw new Error('Falha ao buscar times')
    }
  }

  // Buscar um time específico
  static async getTime(id: number): Promise<Time> {
    try {
      const response = await api.get(`/times/time/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar time ${id}:`, error)
      throw new Error('Falha ao buscar time')
    }
  }

  // Criar time - usando sua API atual
  static async createTime(time: Omit<Time, 'id'>): Promise<Time> {
    try {
      const timeData = {
        ...time,
        temporada: time.temporada || '2025'
      }
      const response = await api.post('/times/time', timeData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar time:', error)
      throw new Error('Falha ao criar time')
    }
  }

  // Atualizar time - usando sua API atual
  static async updateTime(id: number, time: Partial<Time>): Promise<Time> {
    try {
      const response = await api.put(`/times/time/${id}`, time)
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar time ${id}:`, error)
      throw new Error('Falha ao atualizar time')
    }
  }

  // Deletar time - usando sua API atual
  static async deleteTime(id: number): Promise<void> {
    try {
      await api.delete(`/times/time/${id}`)
    } catch (error) {
      console.error(`Erro ao deletar time ${id}:`, error)
      throw new Error('Falha ao deletar time')
    }
  }

  // Buscar jogadores de um time
  static async getTimeJogadores(timeId: number, temporada?: string): Promise<any[]> {
    try {
      const params = temporada ? `?temporada=${temporada}` : ''
      const response = await api.get(`/times/time/${timeId}/jogadores${params}`)
      return response.data || []
    } catch (error) {
      console.error(`Erro ao buscar jogadores do time ${timeId}:`, error)
      throw new Error('Falha ao buscar jogadores do time')
    }
  }
}