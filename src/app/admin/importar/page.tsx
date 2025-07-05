"use client"

import { useState } from 'react'
import { 
  Upload, FileSpreadsheet, Users, Calendar, BarChart3, 
  CheckCircle, AlertTriangle, Clock, Download, RefreshCw,
  ArrowRight, FileText, Target, Trophy
} from 'lucide-react'
import { 
  useImportarTimes, 
  useImportarJogadores, 
  useImportarAgendaJogos, 
  useAtualizarEstatisticas,
  useImportarResultados
} from '@/hooks/useImportacao'

type ImportStep = 'times' | 'jogadores' | 'agenda' | 'resultados' | 'estatisticas'

interface ImportStepConfig {
  id: ImportStep
  title: string
  description: string
  icon: any
  color: string
  required: boolean
  status: 'pending' | 'success' | 'error' | 'disabled'
  fileFormat: string
  columns: string[]
  examples: string[]
}

export default function AdminImportarPage() {
  const [activeStep, setActiveStep] = useState<ImportStep>('times')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    id_jogo: '',
    data_jogo: ''
  })

  // Hooks de importação
  const importTimesMutation = useImportarTimes()
  const importJogadoresMutation = useImportarJogadores()
  const importAgendaMutation = useImportarAgendaJogos()
  const atualizarEstatisticasMutation = useAtualizarEstatisticas()

  const steps: ImportStepConfig[] = [
    {
      id: 'times',
      title: 'Importar Times',
      description: 'Upload da planilha com os 32 times da Superliga',
      icon: Users,
      color: 'blue',
      required: true,
      status: importTimesMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
      columns: ['id', 'nome', 'sigla', 'cor', 'cidade', 'bandeira_estado', 'fundacao', 'instagram', 'instagram2', 'logo', 'capacete', 'titulos', 'estadio', 'presidente', 'head_coach', 'instagram_coach', 'coord_ofen', 'coord_defen', 'temporada'],
      examples: ['1', 'Bravos FA', 'BRA', '#c6973f', 'Porto Alegre/RS', 'rio-grande-do-sul.png']
    },
    {
      id: 'jogadores',
      title: 'Importar Jogadores',
      description: 'Upload da planilha com todos os jogadores e suas estatísticas',
      icon: Users,
      color: 'green',
      required: true,
      status: importJogadoresMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
      columns: ['id', 'nome', 'timeFormador', 'time_nome', 'posicao', 'setor', 'experiencia', 'numero', 'idade', 'altura', 'peso', 'instagram', 'instagram2', 'cidade', 'nacionalidade', 'camisa', 'temporada', 'passes_completos', 'passes_tentados', 'jardas_de_passe', 'td_passados', 'corridas', 'jardas_corridas', 'tds_corridos', 'recepcoes', 'jardas_recebidas', 'tds_recebidos', 'tackles_totais', 'sacks_forcado'],
      examples: ['1', 'Regino Alexis', 'Mount Union Raiders', 'América Locomotiva', 'DL', 'Defesa', '2018']
    },
    {
      id: 'agenda',
      title: 'Importar Agenda',
      description: 'Upload da agenda de jogos da temporada (sem placares)',
      icon: Calendar,
      color: 'purple',
      required: true,
      status: importAgendaMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
      columns: ['data', 'time_mandante', 'time_visitante', 'rodada', 'fase', 'conferencia', 'temporada'],
      examples: ['2025-07-06', 'Recife Mariners', 'Caruaru Wolves', '1', 'Temporada Regular', 'Nordeste', '2025']
    },
    {
      id: 'resultados',
      title: 'Importar Resultados',
      description: 'Upload de placares dos jogos após finalizados',
      icon: Trophy,
      color: 'yellow',
      required: false,
      status: 'pending',
      fileFormat: 'Excel (.xlsx)',
      columns: ['id_jogo', 'placar_mandante', 'placar_visitante', 'status', 'observacoes'],
      examples: ['1', '21', '14', 'FINALIZADO', 'Jogo bem disputado']
    },
    {
      id: 'estatisticas',
      title: 'Importar Estatísticas',
      description: 'Upload de estatísticas individuais após cada jogo',
      icon: BarChart3,
      color: 'orange',
      required: false,
      status: 'pending',
      fileFormat: 'Excel (.xlsx)',
      columns: ['id_jogo', 'data_jogo', 'jogador_nome', 'time_nome', 'passes_completos', 'passes_tentados', 'jardas_de_passe', 'td_passados', 'corridas', 'jardas_corridas', 'tds_corridos', 'recepcoes', 'jardas_recebidas', 'tds_recebidos', 'tackles_totais', 'sacks_forcado'],
      examples: ['1', '2025-07-06', 'João Silva', 'Flamengo Imperadores', '15', '20', '250', '2']
    }
  ]

  const currentStep = steps.find(step => step.id === activeStep)!
  const isUploading = importTimesMutation.isPending || 
                     importJogadoresMutation.isPending ||
                     importAgendaMutation.isPending ||
                     atualizarEstatisticasMutation.isPending

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      alert('Selecione um arquivo')
      return
    }

    try {
      switch (activeStep) {
        case 'times':
          await importTimesMutation.mutateAsync(selectedFile)
          break
        case 'jogadores':
          await importJogadoresMutation.mutateAsync(selectedFile)
          break
        case 'agenda':
          await importAgendaMutation.mutateAsync(selectedFile)
          break
        case 'resultados':
          await importResultadosMutation?.mutateAsync(selectedFile)
          break
          if (!formData.id_jogo || !formData.data_jogo) {
            alert('Preencha o ID do jogo e a data')
            return
          }
          await atualizarEstatisticasMutation.mutateAsync({
            arquivo: selectedFile,
            idJogo: formData.id_jogo,
            dataJogo: formData.data_jogo
          })
          break
      }
      
      // Reset form after success
      setSelectedFile(null)
      setFormData({ id_jogo: '', data_jogo: '' })
      
    } catch (error) {
      console.error('Erro no upload:', error)
    }
  }

  const getStepStatus = (step: ImportStepConfig) => {
    switch (step.id) {
      case 'times':
        return importTimesMutation.isSuccess ? 'success' : 'pending'
      case 'jogadores':
        return importJogadoresMutation.isSuccess ? 'success' : 'pending'
      case 'agenda':
        return importAgendaMutation.isSuccess ? 'success' : 'pending'
      case 'resultados':
        return importResultadosMutation?.isSuccess ? 'success' : 'pending'
      case 'estatisticas':
        return atualizarEstatisticasMutation.isSuccess ? 'success' : 'pending'
      default:
        return 'pending'
    }
  }

  const getStepIcon = (step: ImportStepConfig) => {
    const status = getStepStatus(step)
    if (status === 'success') return <CheckCircle className="w-5 h-5 text-green-400" />
    if (isUploading && activeStep === step.id) return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
    return <step.icon className="w-5 h-5 text-gray-400" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Importação de Dados</h1>
          <p className="mt-1 text-sm text-gray-400">
            Faça upload das planilhas para configurar a Superliga
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            Baixar Modelos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com Steps */}
        <div className="lg:col-span-1">
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
            <h3 className="font-semibold text-white mb-4">Etapas de Importação</h3>
            
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeStep === step.id 
                      ? 'bg-[#63E300]/20 border border-[#63E300]/50' 
                      : 'hover:bg-[#1C1C24]'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStepIcon(step)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        activeStep === step.id ? 'text-[#63E300]' : 'text-white'
                      }`}>
                        {step.title}
                      </span>
                      {step.required && (
                        <span className="text-xs text-red-400">*</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">
                      {step.description}
                    </p>
                  </div>
                  
                  {getStepStatus(step) === 'success' && (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3">
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            {/* Cabeçalho da Etapa */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 bg-${currentStep.color}-500/20 rounded-lg`}>
                <currentStep.icon className={`w-6 h-6 text-${currentStep.color}-400`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentStep.title}</h2>
                <p className="text-gray-400">{currentStep.description}</p>
              </div>
            </div>

            {/* Formulário de Upload */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campos especiais para estatísticas */}
              {activeStep === 'estatisticas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ID do Jogo
                    </label>
                    <input
                      type="text"
                      value={formData.id_jogo}
                      onChange={(e) => setFormData(prev => ({ ...prev, id_jogo: e.target.value }))}
                      className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white"
                      placeholder="Ex: 123"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Data do Jogo
                    </label>
                    <input
                      type="date"
                      value={formData.data_jogo}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_jogo: e.target.value }))}
                      className="w-full p-3 bg-[#1C1C24] border border-gray-600 rounded-lg text-white"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Área de Upload */}
              <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                selectedFile 
                  ? 'border-[#63E300] bg-[#63E300]/5' 
                  : 'border-gray-600 bg-[#1C1C24]'
              }`}>
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                
                <label htmlFor="file-input" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <FileSpreadsheet className="w-12 h-12 text-[#63E300]" />
                    
                    {selectedFile ? (
                      <div>
                        <div className="font-medium text-[#63E300] mb-1">
                          {selectedFile.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-white mb-1">
                          Clique para selecionar arquivo
                        </div>
                        <div className="text-sm text-gray-400">
                          {currentStep.fileFormat} - Máximo 10MB
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Botão de Upload */}
              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full bg-[#63E300] text-black py-3 px-6 rounded-lg font-semibold hover:bg-[#50B800] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {currentStep.title}
                  </>
                )}
              </button>
            </form>

            {/* Informações da Planilha */}
            <div className="mt-6 p-4 bg-[#1C1C24] rounded-lg">
              <h4 className="font-semibold text-white mb-3">Formato da Planilha</h4>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Colunas obrigatórias:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentStep.columns.map((column, index) => (
                      <span key={index} className="text-xs bg-[#272731] text-[#63E300] px-2 py-1 rounded">
                        {column}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">Exemplo de dados:</span>
                  <div className="text-xs text-gray-300 mt-1 font-mono">
                    {currentStep.examples.join(' | ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagens de Status */}
            {importTimesMutation.isSuccess && activeStep === 'times' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Times importados com sucesso!</span>
                </div>
              </div>
            )}

            {importJogadoresMutation.isSuccess && activeStep === 'jogadores' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Jogadores importados com sucesso!</span>
                </div>
              </div>
            )}

            {importAgendaMutation.isSuccess && activeStep === 'agenda' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Agenda de jogos importada com sucesso!</span>
                </div>
              </div>
            )}

            {importResultadosMutation?.isSuccess && activeStep === 'resultados' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Resultados dos jogos importados com sucesso!</span>
                </div>
              </div>
            )}

            {atualizarEstatisticasMutation.isSuccess && activeStep === 'estatisticas' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Estatísticas atualizadas com sucesso!</span>
                </div>
              </div>
            )}

            {/* Mensagens de Erro */}
            {(importTimesMutation.error || importJogadoresMutation.error || importAgendaMutation.error || atualizarEstatisticasMutation.error) && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Erro na importação</span>
                </div>
                <p className="text-red-300 text-sm mt-1">
                  {(importTimesMutation.error || importJogadoresMutation.error || importAgendaMutation.error || atualizarEstatisticasMutation.error)?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Sequência Recomendada</h3>
        
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                getStepStatus(step) === 'success' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                <span className="text-sm font-medium">{index + 1}</span>
                <span className="text-sm">{step.title}</span>
                {getStepStatus(step) === 'success' && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </div>
              
              {index < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-600" />
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-400 mt-3">
          Siga esta sequência para configurar corretamente a Superliga. 
          Após importar times, jogadores e agenda, você poderá criar a Superliga.
        </p>
      </div>
    </div>
  )
}