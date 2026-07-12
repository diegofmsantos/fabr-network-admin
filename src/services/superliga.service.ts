/**
 * superliga.service.ts — atualizado para D1/D2
 * Substitui: src/services/superliga.service.ts (frontend admin)
 *
 * MUDANÇAS (mínimas):
 *  - criarSuperliga: aceita { temporada, divisao }
 *  - configurarConferencias: aceita { temporada, divisao }, passa divisao no body
 *  - distribuirTimesAutomatico: aceita { temporada, divisao }, passa divisao no body
 *  - Tudo mais permanece idêntico
 */
import { BaseService } from './base.service'

type CriarSuperligaParams = { temporada: string; divisao?: string }

export class SuperligaService extends BaseService {

  static async getSuperliga(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}`)
  }

  static async criarSuperliga({ temporada, divisao = 'D1' }: CriarSuperligaParams) {
    const service = new SuperligaService()
    return service.post('/superliga/criar', { temporada, divisao })
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

  static async configurarConferencias({ temporada, divisao = 'D1' }: CriarSuperligaParams) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/configurar-conferencias`, { divisao })
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

  static async distribuirTimesAutomatico({ temporada, divisao = 'D1' }: CriarSuperligaParams) {
    const service = new SuperligaService()
    return service.post(`/superliga/${temporada}/distribuir-times`, { divisao })
  }

  static async getTimes(temporada: string, conferencia?: string, regional?: string) {
    const service = new SuperligaService()
    const params = new URLSearchParams()
    if (conferencia) params.append('conferencia', conferencia)
    if (regional) params.append('regional', regional)
    const url = `/superliga/${temporada}/times${params.toString() ? `?${params.toString()}` : ''}`
    return service.get(url)
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

  static async getHistorico(temporadas: string[]) {
    const service = new SuperligaService()
    return service.get('/superliga/historico', { temporadas: temporadas.join(',') })
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