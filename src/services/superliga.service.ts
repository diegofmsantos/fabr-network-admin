import { ConferenciaConfig, TipoConferencia, TipoRegional } from '@/types'
import { BaseService } from './base.service'

export class SuperligaService extends BaseService {
  
  // ==================== CRIAÇÃO E CONFIGURAÇÃO ====================
  
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
    return service.post(`/superliga/campeonatos/${campeonatoId}/configurar-conferencias`, {
      config
    })
  }

  static async distribuirTimes(campeonatoId: number, distribuicao: Record<TipoRegional, number[]>) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/distribuir-times-superliga`, {
      distribuicao
    })
  }

  static async distribuirTimesAutomaticamente(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/distribuir-times-automatico`)
  }

  // ==================== GERAÇÃO DE JOGOS ====================

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

  static async resetarPlayoffs(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/resetar-playoffs`)
  }

  // ==================== CONSULTAS GERAIS ====================

  static async getSuperliga(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}`)
  }

  static async getStatusSuperliga(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/status`)
  }

  static async getConferencias(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/conferencias`)
  }

  static async getTimesPorConferencia(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/times-por-conferencia`)
  }

  // ==================== CLASSIFICAÇÕES ====================

  static async getClassificacaoGeral(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/classificacao-geral`)
  }

  static async getClassificacaoConferencia(campeonatoId: number, conferencia: TipoConferencia) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/classificacao-conferencia/${conferencia}`)
  }

  static async getClassificacaoRegional(campeonatoId: number, regional: TipoRegional) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/classificacao-regional/${regional}`)
  }

  static async getRankingGeral(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/ranking-geral`)
  }

  static async getWildCardRanking(campeonatoId: number, conferencia: TipoConferencia) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/wild-card-ranking/${conferencia}`)
  }

  // ==================== PLAYOFFS ====================

  static async getPlayoffBracket(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/bracket`)
  }

  static async getBracketPlayoffs(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/bracket`)
  }

  static async getPlayoffsConferencia(campeonatoId: number, conferencia: TipoConferencia) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/playoffs/${conferencia}`)
  }

  static async getFaseNacional(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/fase-nacional`)
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

  // ==================== JOGOS ====================

  static async getJogosSuperliga(campeonatoId: number, filters?: {
    conferencia?: string
    fase?: string
    rodada?: number
    status?: string
  }) {
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

  // ==================== ESTATÍSTICAS E ANÁLISES ====================

  static async getEstatisticasSuperliga(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/estatisticas`)
  }

  static async getHistoricoSuperliga(temporadas: string[]) {
    const service = new SuperligaService()
    return service.get(`/superliga/historico`, { 
      temporadas: temporadas.join(',') 
    })
  }

  static async getPrevisoes(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/previsoes`)
  }

  // ==================== VALIDAÇÃO E INTEGRIDADE ====================

  static async validarEstruturaSuperliga(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/validar-integridade`)
  }

  static async validarEstrutura(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/validar-estrutura`)
  }

  static async validarIntegridade(campeonatoId: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/validar-integridade`)
  }

  static async repararIntegridade(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/reparar-integridade`)
  }

  // ==================== SIMULAÇÃO E TESTES ====================

  static async simularPlayoffs(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/simular-playoffs`)
  }

  static async simularTemporadaCompleta(campeonatoId: number) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/simular-temporada`)
  }

  // ==================== GERAÇÃO AUTOMÁTICA ====================

  static async gerarTemporadaCompleta(campeonatoId: number, configuracao: {
    rodadas?: number
    incluirPlayoffs?: boolean
    incluirFaseNacional?: boolean
  }) {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/gerar-temporada-completa`, configuracao)
  }
}