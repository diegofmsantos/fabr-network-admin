import { EstatisticasResponse, ImportacaoResponse, TransferenciasResponse } from '@/types'
import { BaseService } from './base.service'


export class ImportacaoService extends BaseService {
  
  // ==================== IMPORTAÇÃO DE TIMES ====================
  static async importarTimes(arquivo: File): Promise<ImportacaoResponse> {
    const service = new ImportacaoService()
    return service.upload<ImportacaoResponse>('/admin/importar-times', arquivo)
  }

  // ==================== IMPORTAÇÃO DE JOGADORES ====================
  static async importarJogadores(arquivo: File): Promise<ImportacaoResponse> {
    const service = new ImportacaoService()
    return service.upload<ImportacaoResponse>('/admin/importar-jogadores', arquivo)
  }

  // ==================== ATUALIZAÇÃO DE ESTATÍSTICAS ====================
  static async atualizarEstatisticas(
    arquivo: File, 
    idJogo: string, 
    dataJogo: string
  ): Promise<EstatisticasResponse> {
    const service = new ImportacaoService()
    return service.upload<EstatisticasResponse>('/admin/atualizar-estatisticas', arquivo, {
      id_jogo: idJogo,
      data_jogo: dataJogo
    })
  }

  // ==================== INICIAR NOVA TEMPORADA ====================
  static async iniciarTemporada(
    ano: string, 
    alteracoes: {
      timeChanges?: Array<{
        timeId: number
        nome?: string
        sigla?: string
        cor?: string
        instagram?: string
        instagram2?: string
        logo?: string
        capacete?: string
        presidente?: string
        head_coach?: string
        instagram_coach?: string
        coord_ofen?: string
        coord_defen?: string
      }>
      transferencias?: Array<{
        jogadorId: number
        jogadorNome?: string
        timeOrigemId?: number
        timeOrigemNome?: string
        novoTimeId: number
        novoTimeNome?: string
        novaPosicao?: string
        novoSetor?: string
        novoNumero?: number
        novaCamisa?: string
      }>
    }
  ): Promise<TransferenciasResponse> {
    const service = new ImportacaoService()
    return service.post<TransferenciasResponse>(`/admin/iniciar-temporada/${ano}`, alteracoes)
  }

  // ==================== BUSCAR TRANSFERÊNCIAS SALVAS ====================
  static async getTransferencias(
    temporadaOrigem: string, 
    temporadaDestino: string
  ): Promise<any> {
    const service = new ImportacaoService()
    return service.get(`/admin/transferencias-json`, {
      temporadaOrigem,
      temporadaDestino
    })
  }

  // ==================== VALIDAR PLANILHA (OPCIONAL) ====================
  static async validarPlanilhaTimes(arquivo: File): Promise<any> {
    const service = new ImportacaoService()
    return service.upload('/admin/validar-times', arquivo)
  }

  static async validarPlanilhaJogadores(arquivo: File): Promise<any> {
    const service = new ImportacaoService()
    return service.upload('/admin/validar-jogadores', arquivo)
  }

  // ==================== MÉTODOS AUXILIARES ====================
  
  // Verificar se uma temporada existe
  static async verificarTemporada(temporada: string): Promise<boolean> {
    const service = new ImportacaoService()
    try {
      await service.get(`/admin/temporada/${temporada}/verificar`)
      return true
    } catch {
      return false
    }
  }

  // Obter estatísticas de importação
  static async getEstatisticasImportacao(temporada: string): Promise<{
    times: number
    jogadores: number
    ultimaImportacao: string
  }> {
    const service = new ImportacaoService()
    return service.get(`/admin/estatisticas-importacao`, { temporada })
  }
}