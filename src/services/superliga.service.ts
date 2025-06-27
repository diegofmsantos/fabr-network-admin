import { ConferenciaConfig, PlayoffBracket, PlayoffTeam, SuperligaBracket, TipoConferencia, TipoRegional } from '@/types'
import { BaseService } from './base.service'

export class SuperligaService extends BaseService {
  
  static async criarSuperliga(temporada: string): Promise<any> {
    const service = new SuperligaService()
    return service.post('/campeonatos/superliga/criar', { 
      temporada,
      nome: `Superliga de Futebol Americano ${temporada}`,
      tipo: 'SUPERLIGA'
    })
  }

  static async configurarConferencias(campeonatoId: number, config: ConferenciaConfig[]): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/conferencias`, { config })
  }

  static async distribuirTimesAutomaticamente(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/distribuir-times-superliga`)
  }

  static async gerarJogosTemporadaRegular(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/gerar-jogos-superliga`)
  }

  static async finalizarTemporadaRegular(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/finalizar-temporada-regular`)
  }

  static async gerarPlayoffs(campeonatoId: number): Promise<SuperligaBracket> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/gerar-playoffs-superliga`)
  }

  static async getPlayoffBracket(campeonatoId: number): Promise<SuperligaBracket> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/playoff-bracket`)
  }

  static async gerarPlayoffConferencia(
    campeonatoId: number, 
    conferencia: TipoConferencia
  ): Promise<PlayoffBracket> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/playoffs/${conferencia.toLowerCase()}`)
  }

  static async getPlayoffConferencia(
    campeonatoId: number,
    conferencia: TipoConferencia  
  ): Promise<PlayoffBracket> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/playoffs/${conferencia.toLowerCase()}`)
  }

  static async getClassificacaoConferencia(
    campeonatoId: number,
    conferencia: TipoConferencia
  ): Promise<any> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/classificacao/${conferencia.toLowerCase()}`)
  }

  static async getClassificacaoRegional(
    campeonatoId: number,
    regional: TipoRegional
  ): Promise<any> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/classificacao/regional/${regional.toLowerCase()}`)
  }

  static async getTimesClassificadosParaPlayoffs(campeonatoId: number): Promise<PlayoffTeam[]> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/times-classificados`)
  }

  static async atualizarResultadoPlayoff(
    jogoId: number,
    placarTime1: number,
    placarTime2: number
  ): Promise<any> {
    const service = new SuperligaService()
    return service.put(`/campeonatos/playoff-jogos/${jogoId}/resultado`, {
      placarTime1,
      placarTime2
    })
  }

  static async finalizarJogoPlayoff(jogoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/playoff-jogos/${jogoId}/finalizar`)
  }

  static async gerarSemifinaisNacionais(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/gerar-semifinais-nacionais`)
  }

  static async gerarFinalNacional(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/gerar-final-nacional`)
  }

  static async getFinalNacional(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/final-nacional`)
  }

  static async resetarPlayoffs(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/resetar-playoffs`)
  }

  static async getEstatisticasSuperliga(campeonatoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/estatisticas-superliga`)
  }

  static async simularPlayoffs(campeonatoId: number): Promise<SuperligaBracket> {
    const service = new SuperligaService()
    return service.post(`/campeonatos/${campeonatoId}/simular-playoffs`)
  }

  static async validarEstruturaSuperliga(campeonatoId: number): Promise<{
    valida: boolean
    erros: string[]
    avisos: string[]
  }> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/validar-estrutura`)
  }

  static async getStatusSuperliga(campeonatoId: number): Promise<{
    fase: 'CONFIGURACAO' | 'TEMPORADA_REGULAR' | 'PLAYOFFS' | 'FINALIZADO'
    proximoPasso: string
    podeAvancar: boolean
    motivos?: string[]
  }> {
    const service = new SuperligaService()
    return service.get(`/campeonatos/${campeonatoId}/status`)
  }

    static async getRankingGeral(campeonatoId: number): Promise<{
    porConferencia: {
      [key: string]: any[]
    }
    geral: any[]
    criterios: string[]
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/ranking`)
  }

    static async getFaseNacional(campeonatoId: number): Promise<{
    semifinais: any[]
    final: any
    status: string
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/fase-nacional`)
  }

    static async getBracketPlayoffs(campeonatoId: number): Promise<SuperligaBracket> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/bracket`)
  }
}