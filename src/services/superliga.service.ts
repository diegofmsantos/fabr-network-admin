import { ConferenciaConfig, TipoConferencia, TipoRegional } from '@/types'
import { BaseService } from './base.service'

export class SuperligaService extends BaseService {
  
  // ✅ CORRIGIDO: Rota deve ser /superliga/criar
  static async criarSuperliga(temporada: string) {
    const service = new SuperligaService()
    return service.post('/superliga/criar', {
      temporada,
      nome: `Superliga de Futebol Americano ${temporada}`,
      dataInicio: new Date(),
      descricao: `Campeonato nacional de futebol americano - temporada ${temporada}`
    })
  }

  static async configurarConferencias(campeonatoId: number, config: ConferenciaConfig[]) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/distribuir-times-superliga`, {
      distribuicao: config
    })
  }

  static async distribuirTimes(campeonatoId: number, distribuicao: Record<TipoRegional, number[]>) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/distribuir-times-superliga`, {
      distribuicao
    })
  }

  static async distribuirTimesAutomatico(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/distribuir-times-automatico`)
  }

  static async gerarJogosTemporada(campeonatoId: number, rodadas: number = 4) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/gerar-jogos-temporada`, {
      rodadas
    })
  }

  static async gerarPlayoffs(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/gerar-playoffs`)
  }

  static async gerarFaseNacional(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/gerar-fase-nacional`)
  }

  static async getSuperliga(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}`)
  }

  static async getClassificacaoConferencia(campeonatoId: number, conferencia: TipoConferencia) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/classificacao-conferencia/${conferencia}`)
  }

  static async getClassificacaoRegional(campeonatoId: number, regional: TipoRegional) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/classificacao-regional/${regional}`)
  }

  static async getPlayoffsConferencia(campeonatoId: number, conferencia: TipoConferencia) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/playoffs/${conferencia}`)
  }

  static async getFaseNacional(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/fase-nacional`)
  }

  static async getRankingGeral(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/ranking-geral`)
  }

  static async getWildCardRanking(campeonatoId: number, conferencia: TipoConferencia) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/wild-card-ranking/${conferencia}`)
  }

  static async validarIntegridade(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/validar-integridade`)
  }

  static async repararIntegridade(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/reparar-integridade`)
  }

  static async validarEstrutura(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/validar-estrutura`)
  }

  // ✅ ADICIONANDO MÉTODOS QUE FALTAVAM:
  static async getPlayoffBracket(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/bracket`)
  }

  static async getBracketPlayoffs(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/bracket`)
  }

  static async atualizarResultadoPlayoff(jogoId: number, placarTime1: number, placarTime2: number) {
    const service = new SuperligaService()
    return service.put(`/superliga/playoff-jogos/${jogoId}/resultado`, {
      placarTime1,
      placarTime2
    })
  }

  static async finalizarJogoPlayoff(jogoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/playoff-jogos/${jogoId}/finalizar`)
  }

  static async getConferencias(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/conferencias`)
  }

  static async simularPlayoffs(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/simular-playoffs`)
  }

  static async getPrevisoes(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/previsoes`)
  }

  static async getEstatisticasSuperliga(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/estatisticas`)
  }

  static async getJogosSuperliga(campeonatoId: number, filters?: any) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/jogos`, filters)
  }

  static async getProximosJogosSuperliga(campeonatoId: number, limite?: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/proximos-jogos`, { limite })
  }

  static async getUltimosResultadosSuperliga(campeonatoId: number, limite?: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/ultimos-resultados`, { limite })
  }

  static async getHistoricoSuperliga(temporadas: string[]) {
    const service = new SuperligaService()
    return service.get(`/superliga/historico`, { temporadas: temporadas.join(',') })
  }

  static async getTimesPorConferencia(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/times-por-conferencia`)
  }
}