// src/services/times.service.ts
import { Jogador, Time } from '@/types'
import { BaseService } from './base.service'

export class TimesService extends BaseService {
  // Buscar times por temporada
  static async getTimes(temporada: string = '2025'): Promise<Time[]> {
    const service = new TimesService()
    return service.get<Time[]>(`/times/times`, { temporada })
  }

  // Buscar um time específico
  static async getTime(id: number): Promise<Time> {
    const service = new TimesService()
    return service.get<Time>(`/times/time/${id}`)
  }

  // Criar time
  static async createTime(time: Omit<Time, 'id'>): Promise<Time> {
    const service = new TimesService()
    const timeData = {
      ...time,
      temporada: time.temporada || '2025'
    }
    return service.post<Time>('/times/time', timeData)
  }

  // Atualizar time
  static async updateTime(id: number, time: Partial<Time>): Promise<Time> {
    const service = new TimesService()
    return service.put<Time>(`/times/time/${id}`, time)
  }

  // Deletar time
  static async deleteTime(id: number): Promise<void> {
    const service = new TimesService()
    return service.delete(`/times/time/${id}`)
  }

  // Buscar jogadores de um time
  static async getTimeJogadores(timeId: number, temporada?: string): Promise<Jogador[]> {
    const service = new TimesService()
    const params = temporada ? { temporada } : {}
    return service.get<Jogador[]>(`/times/time/${timeId}/jogadores`, params)
  }

  // Importar times via planilha
  static async importarTimes(arquivo: File): Promise<any> {
    const service = new TimesService()
    return service.upload('/admin/importar-times', arquivo)
  }
}