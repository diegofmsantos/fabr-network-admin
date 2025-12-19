"use client"

import { useState } from 'react'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { ExportacaoService } from '@/services/exportacao.service'

interface ExportarEstatisticasProps {
  temporada?: string
}

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

export function ExportarEstatisticas({ temporada = '2025' }: ExportarEstatisticasProps) {
  const [isLoading, setIsLoading] = useState(false)

  const buscarDados = async (): Promise<DadosExportacao[]> => {
    try {
      const response = await ExportacaoService.getEstatisticasParaExportar(temporada)
      console.log('✅ Dados recebidos:', response)
      return response.data
    } catch (error) {
      console.error('❌ Erro ao buscar dados:', error)
      throw error
    }
  }

  const gerarPlanilhaExcel = async () => {
    try {
      setIsLoading(true)
      toast.info('Buscando dados dos jogadores...')

      // 1️⃣ Buscar dados do backend usando o service
      const dados = await buscarDados()

      if (!dados || dados.length === 0) {
        toast.warning('Nenhum dado encontrado para exportar')
        return
      }

      toast.success(`${dados.length} jogadores encontrados. Gerando planilha...`)

      // 2️⃣ Criar workbook
      const wb = XLSX.utils.book_new()

      // 3️⃣ Definir ordem das colunas e cabeçalhos personalizados
      const colunas = [
        // Informações Básicas
        { key: 'nome', label: 'Nome do Jogador' },
        { key: 'numero', label: 'Número' },
        { key: 'time', label: 'Time' },
        { key: 'sigla', label: 'Sigla' },
        { key: 'posicao', label: 'Posição' },
        { key: 'setor', label: 'Setor' },
        { key: 'idade', label: 'Idade' },
        { key: 'altura', label: 'Altura (m)' },
        { key: 'peso', label: 'Peso (kg)' },
        { key: 'experiencia', label: 'Experiência (anos)' },
        { key: 'cidade', label: 'Cidade' },
        { key: 'nacionalidade', label: 'Nacionalidade' },
        { key: 'timeFormador', label: 'Time Formador' },
        
        // Estatísticas de Passe
        { key: 'passes_completos', label: 'Passes Completos' },
        { key: 'passes_tentados', label: 'Passes Tentados' },
        { key: 'jardas_de_passe', label: 'Jardas de Passe' },
        { key: 'td_passados', label: 'TDs Passados' },
        { key: 'interceptacoes_sofridas', label: 'Interceptações Sofridas' },
        { key: 'sacks_sofridos', label: 'Sacks Sofridos' },
        { key: 'fumble_de_passador', label: 'Fumbles (Passador)' },
        
        // Estatísticas de Corrida
        { key: 'corridas', label: 'Corridas' },
        { key: 'jardas_corridas', label: 'Jardas Corridas' },
        { key: 'tds_corridos', label: 'TDs Corridos' },
        { key: 'fumble_de_corredor', label: 'Fumbles (Corredor)' },
        
        // Estatísticas de Recepção
        { key: 'recepcoes', label: 'Recepções' },
        { key: 'alvo', label: 'Alvos' },
        { key: 'jardas_recebidas', label: 'Jardas Recebidas' },
        { key: 'tds_recebidos', label: 'TDs Recebidos' },
        
        // Estatísticas de Retorno
        { key: 'retornos', label: 'Retornos' },
        { key: 'jardas_retornadas', label: 'Jardas Retornadas' },
        { key: 'td_retornados', label: 'TDs Retornados' },
        
        // Estatísticas de Defesa
        { key: 'tackles_totais', label: 'Tackles Totais' },
        { key: 'tackles_for_loss', label: 'Tackles For Loss' },
        { key: 'sacks_forcado', label: 'Sacks Forçados' },
        { key: 'fumble_forcado', label: 'Fumbles Forçados' },
        { key: 'interceptacao_forcada', label: 'Interceptações Forçadas' },
        { key: 'passe_desviado', label: 'Passes Desviados' },
        { key: 'safety', label: 'Safeties' },
        { key: 'td_defensivo', label: 'TDs Defensivos' },
        
        // Estatísticas de Kicker
        { key: 'xp_bons', label: 'Extra Points Bons' },
        { key: 'tentativas_de_xp', label: 'Tentativas de XP' },
        { key: 'fg_bons', label: 'Field Goals Bons' },
        { key: 'tentativas_de_fg', label: 'Tentativas de FG' },
        { key: 'fg_mais_longo', label: 'FG Mais Longo (jardas)' },
        
        // Estatísticas de Punter
        { key: 'punts', label: 'Punts' },
        { key: 'jardas_de_punt', label: 'Jardas de Punt' },
        
        { key: 'temporada', label: 'Temporada' }
      ]

      // 4️⃣ Preparar dados com colunas ordenadas
      const dadosFormatados = dados.map(jogador => {
        const linha: any = {}
        colunas.forEach(col => {
          linha[col.label] = jogador[col.key as keyof DadosExportacao]
        })
        return linha
      })

      // 5️⃣ Criar worksheet
      const ws = XLSX.utils.json_to_sheet(dadosFormatados)

      // 6️⃣ Ajustar largura das colunas
      const colWidths = colunas.map(col => ({
        wch: Math.max(col.label.length + 2, 15)
      }))
      ws['!cols'] = colWidths

      // 7️⃣ Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, `Estatísticas ${temporada}`)

      // 8️⃣ Criar sheet de resumo
      const resumo = [
        ['Relatório de Estatísticas - FABR Network'],
        [''],
        ['Temporada:', temporada],
        ['Total de Jogadores:', dados.length],
        ['Data de Geração:', new Date().toLocaleDateString('pt-BR')],
        ['Hora de Geração:', new Date().toLocaleTimeString('pt-BR')],
        [''],
        ['Observações:'],
        ['- Esta planilha contém todas as estatísticas consolidadas dos jogadores'],
        ['- Os dados são referentes à temporada selecionada'],
        ['- Valores zerados indicam que o jogador não possui estatísticas naquela categoria']
      ]

      const wsResumo = XLSX.utils.aoa_to_sheet(resumo)
      wsResumo['!cols'] = [{ wch: 30 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')

      // 9️⃣ Gerar arquivo Excel
      const nomeArquivo = `FABR_Estatisticas_${temporada}_${new Date().getTime()}.xlsx`
      XLSX.writeFile(wb, nomeArquivo)

      toast.success('Planilha gerada com sucesso! 🎉', {
        description: `Arquivo: ${nomeArquivo}`
      })

    } catch (error) {
      console.error('❌ Erro ao gerar planilha:', error)
      toast.error('Erro ao gerar planilha', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Exportar Estatísticas
          </h3>
          <p className="text-sm text-gray-600">
            Gere uma planilha Excel com todas as estatísticas consolidadas dos jogadores
          </p>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>• Nome do jogador, número, time e posição</p>
            <p>• Estatísticas de Passe, Corrida, Recepção e Defesa</p>
            <p>• Estatísticas de Retorno, Kicker e Punter</p>
            <p>• Dados pessoais (idade, altura, peso, experiência)</p>
          </div>
        </div>

        <button
          onClick={gerarPlanilhaExcel}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Gerar Excel
            </>
          )}
        </button>
      </div>

      <div className="mt-4 rounded-md bg-blue-50 p-3 border border-blue-100">
        <div className="flex gap-2">
          <div className="text-blue-600 text-sm">
            <strong>💡 Dica:</strong> A planilha será gerada com todas as estatísticas consolidadas da temporada {temporada}.
            O processo pode levar alguns segundos dependendo da quantidade de jogadores.
          </div>
        </div>
      </div>
    </div>
  )
}