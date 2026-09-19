"use client"

import React, { useState } from 'react'
import { Upload, FileSpreadsheet, Users, Calendar, BarChart3, CheckCircle, AlertTriangle, Download, RefreshCw, ArrowRight, Trophy, Trash2, Video, Package } from 'lucide-react'
import { useImportarTimes, useImportarJogadores, useImportarAgendaJogos, useAtualizarEstatisticas, useImportarResultados, useResetDatabase, useAtualizarVideoPlayByPlay, useAtualizarEstatisticasLote, useAtualizarVideosLote } from '@/hooks/useImportacao'
import { useTemporadaAdmin } from '@/hooks/useTemporadaAdmin'

type ImportStep = 'times' | 'jogadores' | 'agenda' | 'resultados' | 'estatisticas' | 'video-playbyplay'
type Divisao = 'D1' | 'D2'

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
  const { temporada } = useTemporadaAdmin()
  const [activeStep, setActiveStep] = useState<ImportStep>('times')
  const [divisao, setDivisao] = useState<Divisao>('D1')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedFilesLote, setSelectedFilesLote] = useState<File[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [formData, setFormData] = useState({ id_jogo: '' })

  const importTimesMutation = useImportarTimes()
  const importJogadoresMutation = useImportarJogadores()
  const importAgendaMutation = useImportarAgendaJogos()
  const importResultadosMutation = useImportarResultados()
  const atualizarEstatisticasMutation = useAtualizarEstatisticas()
  const atualizarEstatisticasLoteMutation = useAtualizarEstatisticasLote()
  const atualizarVideoPlayByPlayMutation = useAtualizarVideoPlayByPlay()
  const atualizarVideosLoteMutation = useAtualizarVideosLote()
  const resetDatabaseMutation = useResetDatabase()
  const isResettingDatabase = resetDatabaseMutation.isPending

  // Abas que precisam do seletor de divisão
  const ABAS_COM_DIVISAO: ImportStep[] = ['agenda', 'jogadores', 'resultados']

  const steps: ImportStepConfig[] = [
    {
      id: 'times',
      title: 'Importar Times',
      description: 'Upload da planilha com os 26 times D1 ou 26 times D2',
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
      required: true,
      status: importResultadosMutation?.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
    },
    {
      id: 'estatisticas',
      title: 'Importar Estatísticas',
      description: 'Upload de estatísticas individuais após cada jogo',
      icon: BarChart3,
      color: 'orange',
      required: true,
      status: atualizarEstatisticasMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
    },
    {
      id: 'video-playbyplay',
      title: 'Atualizar Vídeo/Play-by-Play',
      description: 'Atualizar vídeo e play-by-play de todos os jogos (até 84 de uma vez)',
      icon: Video,
      color: 'red',
      required: true,
      status: atualizarVideosLoteMutation.isSuccess ? 'success' : 'pending',
      fileFormat: 'Excel (.xlsx)',
    }
  ]

  const currentStep = steps.find(step => step.id === activeStep)!

  const isUploading = importTimesMutation.isPending ||
    importJogadoresMutation.isPending ||
    importAgendaMutation.isPending ||
    importResultadosMutation?.isPending ||
    atualizarEstatisticasMutation.isPending ||
    atualizarEstatisticasLoteMutation.isPending ||
    atualizarVideoPlayByPlayMutation.isPending ||
    atualizarVideosLoteMutation.isPending

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleFilesLoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const arquivos = Array.from(e.target.files)
      if (arquivos.length > 20) {
        alert('Máximo de 20 arquivos por vez')
        return
      }
      setSelectedFilesLote(arquivos)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) { alert('Selecione um arquivo'); return }

    try {
      switch (activeStep) {
        case 'times':
          await importTimesMutation.mutateAsync(selectedFile)
          break
        case 'jogadores':
          await importJogadoresMutation.mutateAsync({ arquivo: selectedFile, temporada, divisao })
          break
        case 'agenda':
          await importAgendaMutation.mutateAsync({ arquivo: selectedFile, temporada, divisao })
          break
        case 'resultados':
          await importResultadosMutation?.mutateAsync({ arquivo: selectedFile, temporada, divisao })
          break
        case 'estatisticas':
          if (!formData.id_jogo) { alert('Preencha o ID do jogo'); return }
          await atualizarEstatisticasMutation.mutateAsync({
            arquivo: selectedFile,
            idJogo: formData.id_jogo,
            dataJogo: ''
          })
          break
        case 'video-playbyplay':
          await atualizarVideosLoteMutation.mutateAsync(selectedFile)
          break
      }
      setSelectedFile(null)
      setFormData({ id_jogo: '' })
    } catch (error) {
      console.error('Erro no upload:', error)
    }
  }

  const handleSubmitLote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFilesLote.length === 0) { alert('Selecione pelo menos um arquivo'); return }
    if (selectedFilesLote.length > 20) { alert('Máximo de 20 arquivos por vez'); return }
    try {
      await atualizarEstatisticasLoteMutation.mutateAsync(selectedFilesLote)
      setSelectedFilesLote([])
    } catch (error) {
      console.error('Erro no upload em lote:', error)
    }
  }

  const getStepStatus = (step: ImportStepConfig) => {
    switch (step.id) {
      case 'times': return importTimesMutation.isSuccess ? 'success' : 'pending'
      case 'jogadores': return importJogadoresMutation.isSuccess ? 'success' : 'pending'
      case 'agenda': return importAgendaMutation.isSuccess ? 'success' : 'pending'
      case 'resultados': return importResultadosMutation?.isSuccess ? 'success' : 'pending'
      case 'estatisticas': return atualizarEstatisticasMutation.isSuccess ? 'success' : 'pending'
      case 'video-playbyplay': return atualizarVideosLoteMutation.isSuccess ? 'success' : 'pending'
      default: return 'pending'
    }
  }

  const handleResetDatabase = async () => {
    if (!showResetConfirm) { setShowResetConfirm(true); return }
    try {
      await resetDatabaseMutation.mutateAsync()
      setShowResetConfirm(false)
    } catch (error) {
      console.error('Erro ao resetar banco:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#272731] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Importar Dados</h1>
          <p className="text-gray-400">
            Temporada ativa: <span className="text-[#63E300] font-bold">{temporada}</span>
            {ABAS_COM_DIVISAO.includes(activeStep) && (
              <span className="ml-2 text-gray-400">
                — Divisão: <span className="text-[#63E300] font-bold">{divisao}</span>
              </span>
            )}
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {steps.map((step) => {
            const Icon = step.icon
            const status = getStepStatus(step)
            const isActive = activeStep === step.id
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-lg border-2 transition-all ${isActive ? 'border-[#63E300] bg-[#63E300]/10'
                    : status === 'success' ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-700 bg-[#1C1C24] hover:border-gray-600'
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[#63E300]' : status === 'success' ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium text-center ${isActive ? 'text-[#63E300]' : status === 'success' ? 'text-green-400' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                  {status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                </div>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Info do step atual */}
            <div className="bg-[#1C1C24] rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <currentStep.icon className="w-6 h-6 text-[#63E300]" />
                <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">{currentStep.description}</p>
              <div className="text-xs text-gray-500">
                <p>Formato: {currentStep.fileFormat}</p>
                <p className="mt-1">Temporada: <span className="text-[#63E300]">{temporada}</span></p>
                {ABAS_COM_DIVISAO.includes(activeStep) && (
                  <p className="mt-1">Divisão: <span className="text-[#63E300]">{divisao}</span></p>
                )}
              </div>
            </div>

            {/* Reset Database */}
            <div className="bg-[#1C1C24] rounded-lg p-6 border border-red-900/50">
              <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Reset do Banco
              </h3>
              <p className="text-gray-400 text-sm mb-4">Remove todos os dados (exceto matérias)</p>
              {!showResetConfirm ? (
                <button
                  onClick={handleResetDatabase}
                  disabled={isResettingDatabase}
                  className="w-full bg-red-900/50 hover:bg-red-800 text-red-400 px-4 py-2 rounded-md font-semibold transition-colors border border-red-800"
                >
                  Resetar Banco
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-400 text-sm font-semibold">⚠️ Esta ação não pode ser desfeita!</p>
                  <div className="flex gap-2">
                    <button onClick={handleResetDatabase} disabled={isResettingDatabase}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition-colors">
                      {isResettingDatabase ? 'Resetando...' : 'Sim, Resetar!'}
                    </button>
                    <button onClick={() => setShowResetConfirm(false)} disabled={isResettingDatabase}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-[#1C1C24] rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <FileSpreadsheet className="w-5 h-5 text-[#63E300]" />
                <h3 className="text-xl font-bold text-white">
                  {activeStep === 'estatisticas' ? 'Importar 1 Jogo' : currentStep.title}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Seletor de Divisão — aparece apenas nas abas relevantes */}
                {ABAS_COM_DIVISAO.includes(activeStep) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Divisão</label>
                    <div className="flex gap-3">
                      {(['D1', 'D2'] as Divisao[]).map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDivisao(d)}
                          className={`px-6 py-2 rounded-md font-bold transition-colors ${divisao === d
                              ? 'bg-[#63E300] text-black'
                              : 'bg-[#272731] text-white border border-gray-700 hover:border-gray-500'
                            }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {divisao === 'D1'
                        ? 'Superliga D1 — 26 times (Sudeste, Sul, Nordeste, Centro-Norte)'
                        : 'Superliga D2 — 26 times (Norte, Sul)'}
                    </p>
                  </div>
                )}

                {/* Upload Area */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Arquivo Excel (.xlsx)</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-[#63E300] transition-colors cursor-pointer">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-white font-medium mb-1">
                        {selectedFile ? selectedFile.name : 'Clique para selecionar'}
                      </p>
                      <p className="text-sm text-gray-500">ou arraste o arquivo aqui</p>
                    </label>
                    <input id="file-upload" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
                    <p className="text-xs text-gray-500 mt-2">Apenas arquivos Excel (.xlsx, .xls)</p>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-[#1C1C24] rounded-md border border-gray-700">
                      <p className="text-sm text-white">
                        Arquivo selecionado: <span className="font-medium text-[#63E300]">{selectedFile.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Campo ID do jogo — só para estatísticas */}
                {activeStep === 'estatisticas' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">ID do Jogo *</label>
                    <input
                      type="text"
                      value={formData.id_jogo}
                      onChange={(e) => setFormData({ id_jogo: e.target.value })}
                      placeholder="Ex: 1"
                      className="w-full px-4 py-3 bg-[#0A0A0F] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
                    />
                  </div>
                )}

                {/* Aviso vídeo/play-by-play */}
                {activeStep === 'video-playbyplay' && (
                  <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-200">
                        <p className="font-semibold mb-1">💡 Como usar:</p>
                        <p>Crie uma planilha Excel com <strong>3 colunas</strong>:</p>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                          <li><strong>jogo_id</strong> — ID do jogo no sistema</li>
                          <li><strong>video_url</strong> — Link do YouTube (embed)</li>
                          <li><strong>play_by_play</strong> — Texto com as jogadas</li>
                        </ul>
                        <p className="mt-3 font-semibold">✅ Você pode importar todos os jogos de uma vez!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${!selectedFile || isUploading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-[#63E300] text-black hover:bg-[#50B800]'
                  }`}
              >
                {isUploading ? (
                  <><RefreshCw className="w-5 h-5 animate-spin" /> Processando...</>
                ) : (
                  <><Upload className="w-5 h-5" />
                    {activeStep === 'video-playbyplay' ? 'Atualizar Vídeos em Lote' : `Importar ${currentStep.title}`}
                    {ABAS_COM_DIVISAO.includes(activeStep) && ` — ${divisao}`}
                  </>
                )}
              </button>
            </form>

            {/* Importação em lote — só para estatísticas */}
            {activeStep === 'estatisticas' && (
              <form onSubmit={handleSubmitLote} className="bg-[#1C1C24] rounded-lg p-6 border border-gray-800">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Importar em Lote (até 20 jogos)</h3>
                </div>

                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <p className="font-semibold mb-1">💡 Como usar:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Selecione até 20 planilhas de uma vez</li>
                        <li>Cada planilha deve ter a coluna <strong>jogo_id</strong></li>
                        <li>As colunas <strong>video_url</strong> e <strong>play_by_play</strong> devem estar preenchidas apenas na 1ª linha</li>
                        <li>O sistema processará todos os arquivos automaticamente</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Arquivos Excel (.xlsx) — Máximo 20</label>
                  <div className="border-2 border-dashed border-purple-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                    <label htmlFor="files-lote-upload" className="cursor-pointer">
                      <Package className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                      <p className="text-white font-medium mb-1">
                        {selectedFilesLote.length > 0
                          ? `${selectedFilesLote.length} arquivo(s) selecionado(s)`
                          : 'Clique para selecionar múltiplos arquivos'}
                      </p>
                      <p className="text-sm text-gray-500">ou arraste os arquivos aqui</p>
                    </label>
                    <input id="files-lote-upload" type="file" accept=".xlsx,.xls" multiple onChange={handleFilesLoteChange} className="hidden" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedFilesLote.length === 0 || atualizarEstatisticasLoteMutation.isPending}
                  className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${selectedFilesLote.length === 0 || atualizarEstatisticasLoteMutation.isPending
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                  {atualizarEstatisticasLoteMutation.isPending ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Processando lote...</>
                  ) : (
                    <><Package className="w-5 h-5" /> Importar {selectedFilesLote.length} arquivo(s) em Lote</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}