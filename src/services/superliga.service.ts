import { BaseService } from './base.service'

export class SuperligaService extends BaseService {
  
  static async getSuperliga(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}`)
  }

  static async criarSuperliga(temporada: string) {
    const service = new SuperligaService()
    return service.post('/superliga/criar', { temporada })
  }

  static async deletarSuperliga(temporada: string) {
    const service = new SuperligaService()
    return service.delete(`/superliga/${temporada}`)
  }
  
  static async getStatus(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/status`)
  }

  static async getEstatisticas(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/estatisticas`)
  }

  static async getResumo(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/resumo`)
  }
  
  static async getConferencias(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/conferencias`)
  }

  static async configurarConferencias(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/configurar-conferencias`)
  }

  static async getRegionais(temporada: string, conferencia?: string) {
    const service = new SuperligaService()
    const url = conferencia 
      ? `/superliga/${temporada}/regionais?conferencia=${conferencia}`
      : `/superliga/${temporada}/regionais`
    return service.get(url)
  }

  static async getTimesPorConferencia(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/times-por-conferencia`)
  }

  static async distribuirTimesAutomatico(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/distribuir-times-automatico`)
  }

  static async getTimes(temporada: string, conferencia?: string, regional?: string) {
    const service = new SuperligaService()
    const params = new URLSearchParams()
    if (conferencia) params.append('conferencia', conferencia)
    if (regional) params.append('regional', regional)
    
    const url = `/superliga/${temporada}/times${params.toString() ? `?${params.toString()}` : ''}`
    return service.get(url)
  }
  
  static async gerarJogosTemporada(temporada: string, config: { rodadas?: number }) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/gerar-jogos-temporada`, config)
  }

  static async getJogos(temporada: string, filters?: {
    conferencia?: string
    fase?: string
    rodada?: number
    status?: string
    limit?: number
  }) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/jogos`, filters)
  }
  

  static async getProximosJogos(temporada: string, limite?: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/proximos-jogos`, { limite })
  }

  static async getUltimosResultados(temporada: string, limite?: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/ultimos-resultados`, { limite })
  }

  static async getJogosPorRodada(temporada: string, rodada: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/jogos/rodada/${rodada}`)
  }
  
  static async getClassificacaoGeral(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao-geral`)
  }

  static async getClassificacaoConferencia(temporada: string, conferencia: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao-conferencia/${conferencia}`)
  }

  static async getClassificacaoRegional(temporada: string, regional: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao-regional/${regional}`)
  }

  static async getRankingGeral(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/ranking-geral`)
  }

  static async getWildCardRanking(temporada: string, conferencia: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/wild-card-ranking/${conferencia}`)
  }
  
  static async gerarPlayoffs(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/gerar-playoffs`)
  }

  static async resetarPlayoffs(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/resetar-playoffs`)
  }

  static async getBracket(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/bracket`)
  }

  static async getPlayoffsConferencia(temporada: string, conferencia: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/playoffs/${conferencia}`)
  }

  static async getFaseNacional(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/fase-nacional`)
  }

  static async gerarFaseNacional(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/gerar-fase-nacional`)
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
  
  static async validarEstrutura(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/validar-estrutura`)
  }

  static async validarIntegridade(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/validar-integridade`)
  }

  static async repararIntegridade(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/reparar-integridade`)
  }
  
  static async simularPlayoffs(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/simular-playoffs`)
  }

  static async simularTemporadaCompleta(temporada: string) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/simular-temporada`)
  }

  static async gerarTemporadaCompleta(temporada: string, configuracao: {
    rodadas?: number
    incluirPlayoffs?: boolean
    incluirFaseNacional?: boolean
  }) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/gerar-temporada-completa`, configuracao)
  }
  
  static async getHistorico(temporadas: string[]) {
    const service = new SuperligaService()
    return service.get('/superliga/historico', { 
      temporadas: temporadas.join(',') 
    })
  }

  static async getComparacaoTemporadas(temporada1: string, temporada2: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/comparacao/${temporada1}/${temporada2}`)
  }

  static async getEstatisticasDetalhadas(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/estatisticas-detalhadas`)
  }
  
  static async listarTemporadas() {
    const service = new SuperligaService()
    return service.get('/superliga/temporadas')
  }

  static async getTemporadaAtual() {
    const service = new SuperligaService()
    return service.get('/superliga/atual')
  }

  static async exportarDados(temporada: string, formato: 'json' | 'csv' | 'xlsx' = 'json') {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/exportar`, { formato })
  }

  static async getClassificacao(temporada: string) {
  const service = new SuperligaService()
  return service.get(`/superliga/${temporada}/classificacao`)
}
}