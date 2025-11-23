import { EstatisticaJogo, Estatisticas, Jogador, Jogo } from '@/types'
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

  static async updateEstatisticaJogo(id: number, estatisticas: Estatisticas): Promise<EstatisticaJogo> {
    console.log(`🔄 [SERVICE] Atualizando estatística de jogo ${id}`)

    const service = new JogadoresService()
    return service.put<EstatisticaJogo>(`/admin/estatistica-jogo/${id}`, { estatisticas })
  }

  static async getEstatisticaJogoPorId(id: number): Promise<EstatisticaJogo> {
    console.log(`🔍 [SERVICE] Buscando estatística de jogo ${id}`)

    const service = new JogadoresService()
    return service.get<EstatisticaJogo>(`/admin/estatistica-jogo/${id}`)
  }

   static async getEstatisticasJogo(jogadorId: number, temporada: string = '2025'): Promise<EstatisticaJogo[]> {
    console.log(`🔍 [SERVICE] Chamando rota: /jogadores/${jogadorId}/estatisticas-jogo?temporada=${temporada}`)

    const service = new JogadoresService()
    return service.get<EstatisticaJogo[]>(`/jogadores/${jogadorId}/estatisticas-jogo`, { temporada })
  }

  static async getRankingTemporadaRegular(
  categoria: string, 
  temporada: string = '2025', 
  limite: number = 50
) {
  const service = new JogadoresService()
  return service.get(`/ranking/temporada-regular/${categoria}`, {
    temporada,
    limite: limite.toString()
  })
}
}