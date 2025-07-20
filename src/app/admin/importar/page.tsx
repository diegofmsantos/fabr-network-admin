"use client"

import { useState } from 'react'
import { Upload, FileSpreadsheet, Users, Calendar, BarChart3, CheckCircle, AlertTriangle, Download, RefreshCw, ArrowRight, Trophy, Trash2 } from 'lucide-react'
import { useImportarTimes, useImportarJogadores, useImportarAgendaJogos, useAtualizarEstatisticas, useImportarResultados, useResetDatabase } from '@/hooks/useImportacao'


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
  const resetDatabaseMutation = useResetDatabase()
  const isResettingDatabase = resetDatabaseMutation.isPending

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
      status: importResultadosMutation?.isSuccess ? 'success' : 'pending', // ✅ CORRIGIDO - agora funciona
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
    }
  ]

  const currentStep = steps.find(step => step.id === activeStep)!

  const isUploading = importTimesMutation.isPending ||
    importJogadoresMutation.isPending ||
    importAgendaMutation.isPending ||
    importResultadosMutation?.isPending ||
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
          await importResultadosMutation?.mutateAsync(selectedFile) // ✅ CORRIGIDO - agora funciona
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
      }

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

        <div className="mt-4 sm:mt-0 flex gap-3">
          <button className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors">
            <Download className="w-4 h-4" />
            Baixar Templates
          </button>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeStep === step.id
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

              {activeStep === 'estatisticas' && (
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
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Data do Jogo *</label>
                    <input
                      type="date"
                      value={formData.data_jogo}
                      onChange={(e) => setFormData({ ...formData, data_jogo: e.target.value })}
                      className="w-full px-4 py-3 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${!selectedFile || isUploading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#63E300] text-black hover:bg-[#50B800]'
                  }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Importar {currentStep.title}
                  </>
                )}
              </button>
            </form>

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

            {(importTimesMutation.error || importJogadoresMutation.error || importAgendaMutation.error || importResultadosMutation?.error || atualizarEstatisticasMutation.error) && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Erro na importação</span>
                </div>
                <p className="text-red-300 text-sm mt-1">
                  {(importTimesMutation.error || importJogadoresMutation.error || importAgendaMutation.error || importResultadosMutation?.error || atualizarEstatisticasMutation.error)?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Sequência Recomendada</h3>

        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStepStatus(step) === 'success'
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
      <div className="mt-12 border-t border-gray-700 pt-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />

            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                ⚠️ Zona de Perigo
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Esta ação irá <strong>deletar TODOS os dados</strong> do banco de dados
                e resetar os IDs para 1. Use apenas para desenvolvimento/teste.
              </p>

              <div className="bg-red-950/50 border border-red-600/30 rounded p-3 mb-4">
                <p className="text-red-300 text-xs">
                  <strong>⚠️ ATENÇÃO:</strong> Esta operação não pode ser desfeita!
                  Todos os times, jogadores, jogos, estatísticas e campeonatos serão permanentemente removidos.
                </p>
              </div>

              {!showResetConfirm ? (
                <button
                  onClick={handleResetDatabase}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  disabled={isResettingDatabase}
                >
                  <Trash2 className="w-4 h-4" />
                  Resetar Banco de Dados
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-yellow-300 text-sm font-medium">
                    🔄 Tem certeza que deseja resetar o banco?
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleResetDatabase}
                      disabled={isResettingDatabase}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {isResettingDatabase ? 'Resetando...' : 'Sim, Resetar Tudo'}
                    </button>

                    <button
                      onClick={() => setShowResetConfirm(false)}
                      disabled={isResettingDatabase}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}