import { BaseService } from './base.service'

export class ImportacaoService extends BaseService {

  static async importarTimes(arquivo: File) {
    const service = new ImportacaoService()
    return service.upload('/admin/importar-times', arquivo)
  }

  static async importarJogadores(arquivo: File) {
    const service = new ImportacaoService()
    return service.upload('/admin/importar-jogadores', arquivo)
  }

  static async atualizarEstatisticas(
    arquivo: File,
    idJogo: string,
    dataJogo: string
  ) {
    const service = new ImportacaoService()
    return service.upload('/admin/atualizar-estatisticas', arquivo, {
      id_jogo: idJogo,
      data_jogo: dataJogo
    })
  }

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
  ) {
    const service = new ImportacaoService()
    return service.post(`/admin/iniciar-temporada/${ano}`, alteracoes)
  }

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

  static async validarPlanilhaTimes(arquivo: File): Promise<any> {
    const service = new ImportacaoService()
    return service.upload('/admin/validar-times', arquivo)
  }

  static async validarPlanilhaJogadores(arquivo: File): Promise<any> {
    const service = new ImportacaoService()
    return service.upload('/admin/validar-jogadores', arquivo)
  }

  static async verificarTemporada(temporada: string): Promise<boolean> {
    const service = new ImportacaoService()
    try {
      await service.get(`/admin/temporada/${temporada}/verificar`)
      return true
    } catch {
      return false
    }
  }

  static async getEstatisticasImportacao(temporada: string): Promise<{
    times: number
    jogadores: number
    ultimaImportacao: string
  }> {
    const service = new ImportacaoService()
    return service.get(`/admin/estatisticas-importacao`, { temporada })
  }
}