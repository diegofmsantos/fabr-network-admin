import { Jogador, Time } from '@/types'
import { BaseService } from './base.service'

export class TimesService extends BaseService {
  static async getTimes(temporada: string = '2026', divisao?: string): Promise<Time[]> {
    const service = new TimesService()
    return service.get<Time[]>(`/times`, { temporada, ...(divisao ? { divisao } : {}) })
  }

  static async getTime(id: number): Promise<Time> {
    const service = new TimesService()
    return service.get<Time>(`/times/${id}`)
  }

  static async createTime(time: Omit<Time, 'id'>): Promise<Time> {
    const service = new TimesService()
    const timeData = {
      ...time,
      temporada: time.temporada || '2026'
    }
    return service.post<Time>('/times', timeData)
  }

  static async updateTime(id: number, time: Partial<Time>): Promise<Time> {
    const service = new TimesService()
    return service.put<Time>(`/times/time/${id}`, time)
  }

  static async deleteTime(id: number): Promise<void> {
    const service = new TimesService()
    return service.delete(`/times/time/${id}`)
  }

  static async getTimeJogadores(timeId: number, temporada?: string): Promise<Jogador[]> {
    const service = new TimesService()
    const params = temporada ? { temporada } : {}
    return service.get<Jogador[]>(`/times/${timeId}/jogadores`, params)
  }

  static async importarTimes(arquivo: File): Promise<any> {
    const service = new TimesService()
    return service.upload('/admin/importar-times', arquivo)
  }

}

