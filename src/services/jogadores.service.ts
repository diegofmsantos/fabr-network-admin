// src/services/jogadores.service.ts
import { Jogador } from '@/types'
import { BaseService } from './base.service'

export class JogadoresService extends BaseService {
  // Buscar jogadores por temporada
  static async getJogadores(temporada: string = '2025'): Promise<Jogador[]> {
    const service = new JogadoresService()
    return service.get<Jogador[]>(`/jogadores/jogadores`, { temporada })
  }

  // Buscar um jogador específico
  static async getJogador(id: number): Promise<Jogador> {
    const service = new JogadoresService()
    return service.get<Jogador>(`/jogadores/jogador/${id}`)
  }

  // Criar jogador
  static async createJogador(jogador: Omit<Jogador, 'id'>): Promise<Jogador> {
    const service = new JogadoresService()
    return service.post<Jogador>('/jogadores/jogador', jogador)
  }

  // Atualizar jogador
  static async updateJogador(id: number, jogador: Partial<Jogador>): Promise<Jogador> {
    const service = new JogadoresService()
    return service.put<Jogador>(`/jogadores/jogador/${id}`, jogador)
  }

  // Deletar jogador
  static async deleteJogador(id: number): Promise<void> {
    const service = new JogadoresService()
    return service.delete(`/jogadores/jogador/${id}`)
  }

  // Importar jogadores via planilha
  static async importarJogadores(arquivo: File): Promise<any> {
    const service = new JogadoresService()
    return service.upload('/admin/importar-jogadores', arquivo)
  }

  // Atualizar estatísticas via planilha
  static async atualizarEstatisticas(arquivo: File, idJogo: string, dataJogo: string): Promise<any> {
    const service = new JogadoresService()
    return service.upload('/admin/atualizar-estatisticas', arquivo, {
      id_jogo: idJogo,
      data_jogo: dataJogo
    })
  }
}