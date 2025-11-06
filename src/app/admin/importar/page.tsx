"use client"

import { useState } from 'react'
import { Upload, FileSpreadsheet, Users, Calendar, BarChart3, CheckCircle, AlertTriangle, Download, RefreshCw, ArrowRight, Trophy, Trash2, Video } from 'lucide-react'
import { useImportarTimes, useImportarJogadores, useImportarAgendaJogos, useAtualizarEstatisticas, useImportarResultados, useResetDatabase, useAtualizarVideoPlayByPlay } from '@/hooks/useImportacao'

// ✅ ATUALIZADO: Adicionado 'video-playbyplay' no type
type ImportStep = 'times' | 'jogadores' | 'agenda' | 'resultados' | 'estatisticas' | 'video-playbyplay'

interface ImportStepConfig {
  id: ImportStep
  title: string
  description: string
  icon: any
  color: string
  required: boolean
  status: 'pending' | 'success' | 'error' | 'disabled'
  fileFormat: string
}

export default function AdminImportarPage() {
  const [activeStep, setActiveStep] = useState<ImportStep>('times')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [formData, setFormData] = useState({
    id_jogo: '',
    data_jogo: ''
  })

  const importTimesMutation = useImportarTimes()
  const importJogadoresMutation = useImportarJogadores()
  const importAgendaMutation = useImportarAgendaJogos()
  const importResultadosMutation = useImportarResultados()
  const atualizarEstatisticasMutation = useAtualizarEstatisticas()
  const atualizarVideoPlayByPlayMutation = useAtualizarVideoPlayByPlay() // ✅ NOVO HOOK
  const resetDatabaseMutation = useResetDatabase()
  const isResettingDatabase = resetDatabaseMutation.isPending

  // ✅ ATUALIZADO: Adicionado novo step 'video-playbyplay'
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
    },
    {
      id: 'resultados',
      title: 'Importar Resultados',
      description: 'Upload de placares dos jogos após finalizados',
      icon: Trophy,
      color: 'yellow',
      required: false,
      status: importResultadosMutation?.isSuccess ? 'success' : 'pending', 
      fileFormat: 'Excel (.xlsx)',
    },
    {
      id: 'estatisticas',
      title: 'Importar Estatísticas',
      description: 'Upload de estatísticas individuais após cada jogo',
      icon: BarChart3,
      color: 'orange',
      required: false,
      status: atualizarEstatisticasMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
    },
    // ✅ NOVO STEP: Video e Play-by-Play
    {
      id: 'video-playbyplay',
      title: 'Atualizar Vídeo/Play-by-Play',
      description: 'Atualizar apenas o vídeo e play-by-play de um jogo já importado',
      icon: Video,
      color: 'pink',
      required: false,
      status: atualizarVideoPlayByPlayMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
    }
  ]

  const currentStep = steps.find(step => step.id === activeStep)!

  const isUploading = importTimesMutation.isPending ||
    importJogadoresMutation.isPending ||
    importAgendaMutation.isPending ||
    importResultadosMutation?.isPending ||
    atualizarEstatisticasMutation.isPending ||
    atualizarVideoPlayByPlayMutation.isPending // ✅ ADICIONADO

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // ✅ ATUALIZADO: Adicionado case para 'video-playbyplay'
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
        case 'estatisticas':
          if (!formData.id_jogo || !formData.data_jogo) {
            alert('Preencha o ID do jogo e a data')
            return
          }
          if (selectedFile) {
            await atualizarEstatisticasMutation.mutateAsync({
              arquivo: selectedFile,
              idJogo: formData.id_jogo,
              dataJogo: formData.data_jogo
            })
          }
          break
        // ✅ NOVO CASE: Video e Play-by-Play
        case 'video-playbyplay':
          if (!formData.id_jogo) {
            alert('Preencha o ID do jogo')
            return
          }
          if (selectedFile) {
            await atualizarVideoPlayByPlayMutation.mutateAsync({
              arquivo: selectedFile,
              idJogo: formData.id_jogo
            })
          }
          break
      }

      setSelectedFile(null)
      setFormData({ id_jogo: '', data_jogo: '' })

    } catch (error) {
      console.error('Erro no upload:', error)
    }
  }

  // ✅ ATUALIZADO: Adicionado case para 'video-playbyplay'
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
      case 'video-playbyplay':
        return atualizarVideoPlayByPlayMutation.isSuccess ? 'success' : 'pending'
      default:
        return 'pending'
    }
  }

  const handleResetDatabase = async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true)
      return
    }

    try {
      await resetDatabaseMutation.mutateAsync()
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('Erro no reset:', error)
    } finally {
      setShowResetConfirm(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Importar Dados</h1>
          <p className="mt-1 text-sm text-gray-400">
            Upload das planilhas para popular a base de dados da Superliga
          </p>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeStep === step.id
                  ? 'bg-[#63E300] text-black'
                  : getStepStatus(step) === 'success'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-[#1C1C24] text-gray-300 hover:bg-gray-700'
              }`}
            >
              <step.icon className="w-4 h-4" />
              {step.title}
              {getStepStatus(step) === 'success' && <CheckCircle className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <currentStep.icon className={`w-8 h-8 text-${currentStep.color}-400`} />
              <div>
                <h3 className="text-xl font-bold text-white">{currentStep.title}</h3>
                <p className="text-gray-400">{currentStep.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Arquivo ({currentStep.fileFormat})
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                  <FileSpreadsheet className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <div className="space-y-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-[#63E300] hover:text-[#50B800]">
                        Clique para selecionar
                      </span>
                      <span className="text-gray-400"> ou arraste o arquivo aqui</span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">
                      Apenas arquivos Excel (.xlsx, .xls)
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-[#1C1C24] rounded-md">
                      <p className="text-sm text-white">
                        Arquivo selecionado: <span className="font-medium">{selectedFile.name}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ ATUALIZADO: Campos para estatisticas E video-playbyplay */}
              {(activeStep === 'estatisticas' || activeStep === 'video-playbyplay') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">ID do Jogo *</label>
                    <input
                      type="text"
                      value={formData.id_jogo}
                      onChange={(e) => setFormData({ ...formData, id_jogo: e.target.value })}
                      placeholder="Ex: 1"
                      className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>
                  
                  {/* ✅ Data só para estatísticas */}
                  {activeStep === 'estatisticas' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Data do Jogo *</label>
                      <input
                        type="date"
                        value={formData.data_jogo}
                        onChange={(e) => setFormData({ ...formData, data_jogo: e.target.value })}
                        className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ✅ NOVO: Aviso específico para video-playbyplay */}
              {activeStep === 'video-playbyplay' && (
                <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-200">
                      <p className="font-semibold mb-1">⚠️ Atenção:</p>
                      <p>Esta opção atualiza APENAS os campos <strong>videoUrl</strong> e <strong>playByPlay</strong>.</p>
                      <p className="mt-1">As estatísticas dos jogadores NÃO serão afetadas ou duplicadas.</p>
                      <p className="mt-2 text-yellow-300">Use esta opção quando o jogo já foi importado e você quer adicionar apenas o vídeo e play-by-play.</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
                  !selectedFile || isUploading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#63E300] text-black hover:bg-[#50B800]'
                }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {activeStep === 'video-playbyplay' ? 'Atualizar Vídeo/Play-by-Play' : `Importar ${currentStep.title}`}
                  </>
                )}
              </button>
            </form>

            {/* Success Messages */}
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
                  <span className="font-semibold">Agenda importada com sucesso!</span>
                </div>
              </div>
            )}

            {importResultadosMutation?.isSuccess && activeStep === 'resultados' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Resultados importados com sucesso!</span>
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

            {/* ✅ NOVA MENSAGEM DE SUCESSO */}
            {atualizarVideoPlayByPlayMutation.isSuccess && activeStep === 'video-playbyplay' && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Vídeo e Play-by-Play atualizados com sucesso!</span>
                </div>
                <p className="text-sm text-green-300 mt-2">
                  Os campos foram atualizados sem afetar as estatísticas dos jogadores.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Database Section */}
      <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-400 mb-2">Zona de Perigo</h3>
            <p className="text-gray-300 text-sm mb-4">
              Esta ação irá remover TODOS os dados do banco (times, jogadores, jogos, estatísticas).
              As notícias/matérias serão preservadas.
            </p>
            <button
              onClick={handleResetDatabase}
              disabled={isResettingDatabase}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${
                showResetConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-900/40 text-red-300 hover:bg-red-900/60 border border-red-500/30'
              }`}
            >
              {isResettingDatabase ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Resetando...
                </>
              ) : showResetConfirm ? (
                <>
                  <Trash2 className="w-4 h-4" />
                  Confirmar Reset do Banco
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Resetar Banco de Dados
                </>
              )}
            </button>
            {showResetConfirm && (
              <button
                onClick={() => setShowResetConfirm(false)}
                className="ml-3 text-sm text-gray-400 hover:text-white"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}