import { Jogador } from '@/types'
import { BaseService } from './base.service'

export class JogadoresService extends BaseService {
  static async getJogadores(temporada: string = '2025'): Promise<Jogador[]> {
    const service = new JogadoresService()
    return service.get<Jogador[]>(`/jogadores/jogadores`, { temporada })
  }

  static async getJogador(id: number): Promise<Jogador> {
    const service = new JogadoresService()
    return service.get<Jogador>(`/jogadores/jogador/${id}`)
  }

  static async createJogador(jogador: Omit<Jogador, 'id'>): Promise<Jogador> {
    const service = new JogadoresService()
    return service.post<Jogador>('/jogadores/jogador', jogador)
  }

  static async updateJogador(id: number, jogador: Partial<Jogador>): Promise<Jogador> {
    const service = new JogadoresService()
    return service.put<Jogador>(`/jogadores/jogador/${id}`, jogador)
  }

  static async deleteJogador(id: number): Promise<void> {
    const service = new JogadoresService()
    return service.delete(`/jogadores/jogador/${id}`)
  }

  static async importarJogadores(arquivo: File): Promise<any> {
    const service = new JogadoresService()
    return service.upload('/admin/importar-jogadores', arquivo)
  }

  static async atualizarEstatisticas(arquivo: File, idJogo: string, dataJogo: string): Promise<any> {
    const service = new JogadoresService()
    return service.upload('/admin/atualizar-estatisticas', arquivo, {
      id_jogo: idJogo,
      data_jogo: dataJogo
    })
  }
}