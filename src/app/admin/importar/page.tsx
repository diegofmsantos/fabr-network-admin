"use client"

import React, { useState } from 'react'
import { Upload, FileSpreadsheet, Users, Calendar, BarChart3, CheckCircle, AlertTriangle, Download, RefreshCw, ArrowRight, Trophy, Trash2, Video, Package } from 'lucide-react'
import { useImportarTimes, useImportarJogadores, useImportarAgendaJogos, useAtualizarEstatisticas, useImportarResultados, useResetDatabase, useAtualizarVideoPlayByPlay, useAtualizarEstatisticasLote } from '@/hooks/useImportacao'

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
  const [selectedFilesLote, setSelectedFilesLote] = useState<File[]>([])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [formData, setFormData] = useState({
    id_jogo: ''
  })

  const importTimesMutation = useImportarTimes()
  const importJogadoresMutation = useImportarJogadores()
  const importAgendaMutation = useImportarAgendaJogos()
  const importResultadosMutation = useImportarResultados()
  const atualizarEstatisticasMutation = useAtualizarEstatisticas()
  const atualizarEstatisticasLoteMutation = useAtualizarEstatisticasLote()
  const atualizarVideoPlayByPlayMutation = useAtualizarVideoPlayByPlay()
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
    atualizarEstatisticasLoteMutation.isPending ||
    atualizarVideoPlayByPlayMutation.isPending

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
          if (!formData.id_jogo) {
            alert('Preencha o ID do jogo')
            return
          }
          if (selectedFile) {
            await atualizarEstatisticasMutation.mutateAsync({
              arquivo: selectedFile,
              idJogo: formData.id_jogo,
              dataJogo: '' // Não é mais necessário
            })
          }
          break
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
      setFormData({ id_jogo: '' })

    } catch (error) {
      console.error('Erro no upload:', error)
    }
  }

  const handleSubmitLote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedFilesLote.length === 0) {
      alert('Selecione pelo menos um arquivo')
      return
    }

    if (selectedFilesLote.length > 20) {
      alert('Máximo de 20 arquivos por vez')
      return
    }

    try {
      await atualizarEstatisticasLoteMutation.mutateAsync(selectedFilesLote)
      setSelectedFilesLote([])
    } catch (error) {
      console.error('Erro no upload em lote:', error)
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
          <p className="text-gray-400">Upload das planilhas para popular a base de dados da Superliga</p>
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
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-[#63E300] bg-[#63E300]/10'
                    : status === 'success'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-gray-700 bg-[#1C1C24] hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-6 h-6 ${isActive ? 'text-[#63E300]' : status === 'success' ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium text-center ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                  {status === 'success' && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Step Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#1C1C24] rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                {React.createElement(currentStep.icon, {
                  className: `w-8 h-8 text-${currentStep.color}-400`
                })}
                <div>
                  <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
                  <p className="text-sm text-gray-400">{currentStep.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Formato:</span>
                  <span className="text-white font-medium">{currentStep.fileFormat}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Obrigatório:</span>
                  <span className={`font-medium ${currentStep.required ? 'text-red-400' : 'text-gray-500'}`}>
                    {currentStep.required ? 'Sim' : 'Não'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${getStepStatus(currentStep) === 'success' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {getStepStatus(currentStep) === 'success' ? '✓ Completo' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Zona de Perigo */}
            <div className="mt-6 bg-red-900/20 border border-red-500 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-red-400">Zona de Perigo</h3>
              </div>
              <p className="text-sm text-red-200 mb-4">
                Resetar o banco de dados irá APAGAR TODOS os dados permanentemente (exceto matérias).
              </p>
              {!showResetConfirm ? (
                <button
                  onClick={handleResetDatabase}
                  disabled={isResettingDatabase}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Resetar Banco de Dados
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-300 font-semibold">Tem certeza? Esta ação não pode ser desfeita!</p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetDatabase}
                      disabled={isResettingDatabase}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                    >
                      {isResettingDatabase ? 'Resetando...' : 'Sim, Resetar!'}
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      disabled={isResettingDatabase}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* ============================================ */}
            {/* IMPORTAÇÃO UNITÁRIA (1 ARQUIVO) */}
            {/* ============================================ */}
            <form onSubmit={handleSubmit} className="bg-[#1C1C24] rounded-lg p-6 border border-gray-800">
              <div className="flex items-center gap-2 mb-6">
                <FileSpreadsheet className="w-5 h-5 text-[#63E300]" />
                <h3 className="text-xl font-bold text-white">
                  {activeStep === 'estatisticas' ? 'Importar 1 Jogo' : currentStep.title}
                </h3>
              </div>

              <div className="space-y-6">
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
                    <input
                      id="file-upload"
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Apenas arquivos Excel (.xlsx, .xls)
                    </p>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-3 bg-[#1C1C24] rounded-md border border-gray-700">
                      <p className="text-sm text-white">
                        Arquivo selecionado: <span className="font-medium text-[#63E300]">{selectedFile.name}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Campos específicos para estatísticas e vídeo */}
                {(activeStep === 'estatisticas' || activeStep === 'video-playbyplay') && (
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

                {/* Aviso para vídeo/play-by-play */}
                {activeStep === 'video-playbyplay' && (
                  <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        <p className="font-semibold mb-1">⚠️ Atenção:</p>
                        <p>Esta opção atualiza APENAS os campos <strong>videoUrl</strong> e <strong>playByPlay</strong>.</p>
                        <p className="mt-1">As estatísticas dos jogadores NÃO serão afetadas ou duplicadas.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
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

            {/* ============================================ */}
            {/* IMPORTAÇÃO EM LOTE (ATÉ 20 ARQUIVOS) */}
            {/* ============================================ */}
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

                <div className="space-y-6">
                  {/* Upload Area */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Arquivos Excel (.xlsx) - Máximo 20</label>
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
                      <input
                        id="files-lote-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        multiple
                        onChange={handleFilesLoteChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Selecione de 1 a 20 arquivos Excel
                      </p>
                    </div>

                    {selectedFilesLote.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-400 font-semibold">Arquivos selecionados:</p>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {selectedFilesLote.map((file, index) => (
                            <div key={index} className="p-3 bg-[#0A0A0F] rounded-md border border-gray-700">
                              <p className="text-sm text-white">
                                <span className="text-purple-400 font-mono">{index + 1}.</span> {file.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={selectedFilesLote.length === 0 || isUploading}
                  className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
                    selectedFilesLote.length === 0 || isUploading
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Processando {selectedFilesLote.length} arquivo(s)...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      Importar {selectedFilesLote.length} Jogo(s) em Lote
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Success/Error Messages */}
            {atualizarEstatisticasMutation.isSuccess && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Estatísticas importadas com sucesso!</span>
                </div>
              </div>
            )}

            {atualizarEstatisticasLoteMutation.isSuccess && atualizarEstatisticasLoteMutation.data && (
              <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Lote processado!</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>✅ Sucessos: {atualizarEstatisticasLoteMutation.data.sucessos}/{atualizarEstatisticasLoteMutation.data.totalArquivos}</p>
                  {atualizarEstatisticasLoteMutation.data.erros > 0 && (
                    <p className="text-yellow-400">⚠️ Erros: {atualizarEstatisticasLoteMutation.data.erros}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}