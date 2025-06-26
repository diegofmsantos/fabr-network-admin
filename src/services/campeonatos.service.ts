import { Campeonato, ClassificacaoGrupo, CriarCampeonatoRequest, FiltroJogos, Grupo, Jogo } from '@/types';
import { BaseService } from './base.service'

export class CampeonatosService extends BaseService {
  static async getCampeonatos(filters?: { temporada?: string; tipo?: string; status?: string;  }): Promise<Campeonato[]> {
    const service = new CampeonatosService()
    return service.get<Campeonato[]>('/campeonatos/campeonatos', filters)
  }

  static async getCampeonato(id: number): Promise<Campeonato> {
    const service = new CampeonatosService()
    return service.get<Campeonato>(`/campeonatos/campeonatos/${id}`)
  }

  static async createCampeonato(data: CriarCampeonatoRequest): Promise<Campeonato> {
    const service = new CampeonatosService()
    return service.post<Campeonato>('/campeonatos/campeonatos', data)
  }

  static async updateCampeonato(id: number, data: Partial<Campeonato>): Promise<Campeonato> {
    const service = new CampeonatosService()
    return service.put<Campeonato>(`/campeonatos/campeonatos/${id}`, data)
  }

  static async deleteCampeonato(id: number): Promise<void> {
    const service = new CampeonatosService()
    return service.delete(`/campeonatos/campeonatos/${id}`)
  }

  static async getGrupos(campeonatoId: number): Promise<Grupo[]> {
    const service = new CampeonatosService()
    return service.get<Grupo[]>(`/campeonatos/campeonatos/${campeonatoId}/grupos`)
  }

  static async createGrupo(data: any): Promise<Grupo> {
    const service = new CampeonatosService()
    return service.post<Grupo>('/campeonatos/grupos', data)
  }

  static async updateGrupo(id: number, data: any): Promise<Grupo> {
    const service = new CampeonatosService()
    return service.put<Grupo>(`/campeonatos/grupos/${id}`, data)
  }

  static async deleteGrupo(id: number): Promise<void> {
    const service = new CampeonatosService()
    return service.delete(`/campeonatos/grupos/${id}`)
  }

  static async getJogos(filters: FiltroJogos): Promise<Jogo[]> {
    const service = new CampeonatosService()
    return service.get<Jogo[]>('/campeonatos/jogos', filters)
  }

  static async getJogo(id: number): Promise<Jogo> {
    const service = new CampeonatosService()
    return service.get<Jogo>(`/campeonatos/jogos/${id}`)
  }

  static async createJogo(data: any): Promise<Jogo> {
    const service = new CampeonatosService()
    return service.post<Jogo>('/campeonatos/jogos', data)
  }

  static async updateJogo(id: number, data: any): Promise<Jogo> {
    const service = new CampeonatosService()
    return service.put<Jogo>(`/campeonatos/jogos/${id}`, data)
  }

  static async deleteJogo(id: number): Promise<void> {
    const service = new CampeonatosService()
    return service.delete(`/campeonatos/jogos/${id}`)
  }

  static async gerarJogos(campeonatoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/campeonatos/${campeonatoId}/gerar-jogos`)
  }

  static async getProximosJogos(campeonatoId: number, limit?: number): Promise<Jogo[]> {
    const service = new CampeonatosService()
    return service.get<Jogo[]>(`/campeonatos/campeonatos/${campeonatoId}/proximos-jogos`, { limit })
  }

  static async getUltimosResultados(campeonatoId: number, limit?: number): Promise<Jogo[]> {
    const service = new CampeonatosService()
    return service.get<Jogo[]>(`/campeonatos/campeonatos/${campeonatoId}/ultimos-resultados`, { limit })
  }

  static async getClassificacao(campeonatoId: number): Promise<ClassificacaoGrupo[]> {
    const service = new CampeonatosService()
    return service.get<ClassificacaoGrupo[]>(`/campeonatos/classificacao/${campeonatoId}`)
  }

  static async getClassificacaoGrupo(grupoId: number): Promise<ClassificacaoGrupo[]> {
    const service = new CampeonatosService()
    return service.get<ClassificacaoGrupo[]>(`/campeonatos/classificacao/grupo/${grupoId}`)
  }

  static async recalcularClassificacao(grupoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/classificacao/recalcular/${grupoId}`)
  }

  static async processarEstatisticasJogo(jogoId: number, data: any): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/jogos/${jogoId}/estatisticas`, data)
  }

  static async getGrupo(id: number): Promise<Grupo> {
    const service = new CampeonatosService()
    return service.get<Grupo>(`/campeonatos/grupos/${id}`)
  }

  static async adicionarTimeAoGrupo(grupoId: number, timeId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/grupos/${grupoId}/times`, { timeId })
  }

  static async removerTimeDoGrupo(grupoId: number, timeId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.delete(`/campeonatos/grupos/${grupoId}/times/${timeId}`)
  }

  static async moverTimesEntreGrupos(
    timesIds: number[],
    grupoOrigemId: number,
    grupoDestinoId: number
  ): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/grupos/mover-times`, {
      timesIds,
      grupoOrigemId,
      grupoDestinoId
    })
  }

  static async esvaziarGrupo(grupoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/grupos/${grupoId}/esvaziar`)
  }

  static async misturarTimesGrupo(grupoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/grupos/${grupoId}/misturar`)
  }

  static async distribuirTimesAutomaticamente(campeonatoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/campeonatos/${campeonatoId}/distribuir-times`)
  }

  static async gerarTodosJogos(campeonatoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/campeonatos/${campeonatoId}/gerar-todos-jogos`)
  }

  static async finalizarFaseGrupos(campeonatoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/campeonatos/${campeonatoId}/finalizar-fase-grupos`)
  }

  static async gerarPlayoffs(campeonatoId: number): Promise<any> {
    const service = new CampeonatosService()
    return service.post(`/campeonatos/campeonatos/${campeonatoId}/gerar-playoffs`)
  }

  static async atualizarResultadoJogo(
    jogoId: number,
    placarCasa: number,
    placarVisitante: number
  ): Promise<Jogo> {
    const service = new CampeonatosService()
    return service.put<Jogo>(`/campeonatos/jogos/${jogoId}/resultado`, {
      placarCasa,
      placarVisitante
    })
  }

  static async finalizarJogo(jogoId: number): Promise<Jogo> {
    const service = new CampeonatosService()
    return service.post<Jogo>(`/campeonatos/jogos/${jogoId}/finalizar`)
  }

  static async adiarJogo(jogoId: number, novaData?: string): Promise<Jogo> {
    const service = new CampeonatosService()
    return service.post<Jogo>(`/campeonatos/jogos/${jogoId}/adiar`, { novaData })
  }
}

