"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Trophy, Calendar, BarChart3, RefreshCw, Eye, Settings, Users, Target, Zap, Award, Play } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useStatusSuperliga, useValidarEstrutura, useValidarIntegridade, useRepararIntegridade, useSuperliga, useConferencias } from '@/hooks/useSuperliga'

// Tipagens corretas baseadas no backend
interface StatusData {
  campeonatoId: number
  fase: string
  jogosTemporadaRegular: {
    total: number
    finalizados: number
    percentual: number
  }
  playoffsStatus?: {
    [key: string]: {
      wildcardCompleto: boolean
      semifinalCompleto: boolean
      finalCompleto: boolean
      campeao?: {
        id: number
        nome: string
        sigla: string
      }
    }
  }
  faseNacionalStatus?: {
    semifinaisCompletas: boolean
    campeaoNacional?: {
      id: number
      nome: string
      sigla: string
    }
  }
}

interface ValidacaoData {
  estruturaValida: boolean
  integridadeValida: boolean
  erros: string[]
  warnings: string[]
  detalhes: {
    conferenciasConfiguradas: boolean
    timesDistribuidos: boolean
    jogosGerados: boolean
    playoffsConfigurados: boolean
    faseNacionalConfigada: boolean
  }
}

interface SuperligaData {
  id: number
  nome: string
  temporada: string
  status: string
  dataInicio: string
  dataFim?: string
}

interface ConferenciaData {
  id: number
  nome: string
  tipo: string
  icone: string
  totalTimes: number
}

export default function SuperligaStatusPage() {
  const params = useParams()
  const router = useRouter()
  const superligaId = params.id as string
  const [refreshing, setRefreshing] = useState(false)

  const { data: superliga, isLoading: loadingSuperliga } = useSuperliga(superligaId)
  const { data: status, isLoading: loadingStatus, refetch: refetchStatus } = useStatusSuperliga(superligaId)
  const { data: conferencias, isLoading: loadingConferencias } = useConferencias(superligaId)
  const { data: validacaoEstrutura, isLoading: loadingValidacao } = useValidarEstrutura(superligaId)
  const { data: validacaoIntegridade } = useValidarIntegridade(superligaId)
  const { mutate: repararIntegridade, isPending: reparandoIntegridade } = useRepararIntegridade()

  const isLoading = loadingSuperliga || loadingStatus || loadingConferencias || loadingValidacao

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetchStatus()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleRepararIntegridade = () => {
    if (confirm('Deseja reparar a integridade da Superliga? Esta ação pode levar alguns minutos.')) {
      repararIntegridade(superligaId, {
        onSuccess: () => {
          refetchStatus()
        }
      })
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!superliga || !status) {
    return (
      <div className="min-h-screen bg-[#1C1C24] p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Superliga não encontrada</h2>
          <p className="text-gray-400">Verifique se o ID está correto</p>
        </div>
      </div>
    )
  }

  const superligaData = superliga as SuperligaData
  const statusData = status as StatusData
  const conferenciasData = conferencias as ConferenciaData[]
  const validacao = validacaoEstrutura as ValidacaoData

  const getFaseStatus = () => {
    switch (statusData.fase) {
      case 'CONFIGURACAO':
        return { icon: Settings, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Configuração' }
      case 'TEMPORADA_REGULAR':
        return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Temporada Regular' }
      case 'PLAYOFFS':
        return { icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Playoffs' }
      case 'FINALIZADO':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Finalizado' }
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Desconhecido' }
    }
  }

  const faseStatus = getFaseStatus()
  const FaseIcon = faseStatus.icon

  const getConferenciaIcon = (tipo: string) => {
    switch (tipo) {
      case 'SUDESTE': return '🏭'
      case 'SUL': return '🧊'
      case 'NORDESTE': return '🌵'
      case 'CENTRO_NORTE': return '🌲'
      default: return '⚽'
    }
  }

  const renderProgressBar = (current: number, total: number, label: string) => {
    const percentage = total > 0 ? (current / total) * 100 : 0
    const color = percentage === 100 ? 'bg-green-500' : percentage > 0 ? 'bg-blue-500' : 'bg-gray-500'
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          <span className="text-white">{current}/{total} ({percentage.toFixed(0)}%)</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const renderValidationItem = (isValid: boolean, label: string, description?: string) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#1C1C24]">
      {isValid ? (
        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
      )}
      <div>
        <p className={`font-medium ${isValid ? 'text-green-400' : 'text-red-400'}`}>
          {label}
        </p>
        {description && (
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href={`/admin/superliga/${superligaId}`}
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#63E300]" />
            Status da Superliga
          </h1>
          <p className="text-gray-400">{superligaData.nome} - Temporada {superligaData.temporada}</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <RefreshCw className={`w-5 h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Status Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${faseStatus.bg}`}>
              <FaseIcon className={`w-6 h-6 ${faseStatus.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fase Atual</p>
              <p className="text-white font-semibold">{faseStatus.label}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Conferências</p>
              <p className="text-white font-semibold">{conferenciasData?.length || 0}/4</p>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Times</p>
              <p className="text-white font-semibold">32</p>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Trophy className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Regionais</p>
              <p className="text-white font-semibold">8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Progresso da Temporada */}
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Progresso da Temporada Regular
          </h2>
          
          <div className="space-y-4">
            {renderProgressBar(
              statusData.jogosTemporadaRegular.finalizados,
              statusData.jogosTemporadaRegular.total,
              'Jogos da Temporada Regular'
            )}
            
            <div className="pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total de Jogos</p>
                  <p className="text-white font-medium">{statusData.jogosTemporadaRegular.total}</p>
                </div>
                <div>
                  <p className="text-gray-400">Jogos por Time</p>
                  <p className="text-white font-medium">4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status dos Playoffs */}
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            Status dos Playoffs
          </h2>
          
          <div className="space-y-3">
            {conferenciasData?.map((conferencia) => {
              const playoffStatus = statusData.playoffsStatus?.[conferencia.tipo]
              const campeao = playoffStatus?.campeao
              
              return (
                <div key={conferencia.id} className="flex items-center justify-between p-3 bg-[#1C1C24] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getConferenciaIcon(conferencia.tipo)}</span>
                    <div>
                      <p className="text-white font-medium">{conferencia.nome}</p>
                      {campeao && (
                        <p className="text-[#63E300] text-sm">Campeão: {campeao.nome}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {playoffStatus?.finalCompleto ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <Award className="w-4 h-4" />
                        <span className="text-sm">Concluído</span>
                      </div>
                    ) : playoffStatus?.wildcardCompleto ? (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Play className="w-4 h-4" />
                        <span className="text-sm">Em andamento</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Aguardando</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Fase Nacional */}
          {statusData.faseNacionalStatus && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-white font-medium">Fase Nacional</p>
                    {statusData.faseNacionalStatus.campeaoNacional && (
                      <p className="text-yellow-400 text-sm">
                        Campeão: {statusData.faseNacionalStatus.campeaoNacional.nome}
                      </p>
                    )}
                  </div>
                </div>
                
                {statusData.faseNacionalStatus.campeaoNacional ? (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Finalizada</span>
                  </div>
                ) : statusData.faseNacionalStatus.semifinaisCompletas ? (
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Play className="w-4 h-4" />
                    <span className="text-sm">Final</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Aguardando</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validação e Integridade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Validação da Estrutura
          </h2>
          
          <div className="space-y-3">
            {renderValidationItem(
              validacao?.detalhes?.conferenciasConfiguradas || false,
              'Conferências Configuradas',
              '4 conferências com suas respectivas regionais'
            )}
            
            {renderValidationItem(
              validacao?.detalhes?.timesDistribuidos || false,
              'Times Distribuídos',
              '32 times organizados nos 8 regionais'
            )}
            
            {renderValidationItem(
              validacao?.detalhes?.jogosGerados || false,
              'Jogos da Temporada Regular',
              '128 jogos (4 por time) gerados'
            )}
            
            {renderValidationItem(
              validacao?.detalhes?.playoffsConfigurados || false,
              'Playoffs Configurados',
              'Chaveamento dos playoffs das conferências'
            )}
            
            {renderValidationItem(
              validacao?.detalhes?.faseNacionalConfigada || false,
              'Fase Nacional',
              'Semifinais e final nacional configuradas'
            )}
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Integridade dos Dados
            </h2>
            
            {!validacao?.integridadeValida && (
              <button
                onClick={handleRepararIntegridade}
                disabled={reparandoIntegridade}
                className="bg-[#63E300] text-black px-4 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {reparandoIntegridade ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Reparando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Reparar
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="space-y-3">
            {validacao?.erros?.length > 0 ? (
              validacao.erros.map((erro, index) => (
                <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <p className="text-red-400 text-sm">{erro}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <p className="text-green-400 text-sm">Nenhum erro encontrado</p>
                </div>
              </div>
            )}
            
            {validacao?.warnings?.length > 0 && (
              <div className="space-y-2">
                <p className="text-yellow-400 text-sm font-medium">Avisos:</p>
                {validacao.warnings.map((warning, index) => (
                  <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <p className="text-yellow-400 text-sm">{warning}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href={`/admin/superliga/${superligaId}/playoffs`}
            className="flex items-center gap-3 p-4 bg-[#1C1C24] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Trophy className="w-5 h-5 text-orange-400" />
            <span className="text-white">Gerenciar Playoffs</span>
          </Link>

          <Link
            href={`/admin/superliga/${superligaId}/fase-nacional`}
            className="flex items-center gap-3 p-4 bg-[#1C1C24] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="text-white">Fase Nacional</span>
          </Link>

          <Link
            href={`/superliga/${superligaData.temporada}`}
            className="flex items-center gap-3 p-4 bg-[#1C1C24] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-white">Visualização Pública</span>
          </Link>

          <Link
            href={`/admin/superliga/${superligaId}`}
            className="flex items-center gap-3 p-4 bg-[#1C1C24] rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="text-white">Configurações</span>
          </Link>
        </div>
      </div>
    </div>
  )
}