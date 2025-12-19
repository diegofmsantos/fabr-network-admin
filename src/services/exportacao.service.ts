import { BaseService } from './base.service'

interface DadosExportacao {
  nome: string
  numero: number
  time: string
  sigla: string
  posicao: string
  setor: string
  passes_completos: number
  passes_tentados: number
  jardas_de_passe: number
  td_passados: number
  interceptacoes_sofridas: number
  sacks_sofridos: number
  fumble_de_passador: number
  corridas: number
  jardas_corridas: number
  tds_corridos: number
  fumble_de_corredor: number
  recepcoes: number
  alvo: number
  jardas_recebidas: number
  tds_recebidos: number
  retornos: number
  jardas_retornadas: number
  td_retornados: number
  tackles_totais: number
  tackles_for_loss: number
  sacks_forcado: number
  fumble_forcado: number
  interceptacao_forcada: number
  passe_desviado: number
  safety: number
  td_defensivo: number
  xp_bons: number
  tentativas_de_xp: number
  fg_bons: number
  tentativas_de_fg: number
  fg_mais_longo: number
  punts: number
  jardas_de_punt: number
  idade: number
  altura: number
  peso: number
  experiencia: number
  cidade: string
  nacionalidade: string
  timeFormador: string
  temporada: string
}

interface ExportacaoResponse {
  success: boolean
  data: DadosExportacao[]
  meta: {
    total: number
    temporada: string
    dataGeracao: string
  }
}

export class ExportacaoService extends BaseService {
  static async getEstatisticasParaExportar(temporada: string = '2025'): Promise<ExportacaoResponse> {
    const service = new ExportacaoService()
    console.log('📊 Buscando dados para exportação...')
    console.log('🔗 URL Base:', process.env.NEXT_PUBLIC_API_BASE_URL)
    console.log('📅 Temporada:', temporada)
    
    return service.get<ExportacaoResponse>('/admin/exportar-estatisticas', { temporada })
  }
}