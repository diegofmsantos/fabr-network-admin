"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Users, Play, CheckCircle, Clock, Zap, Eye, RefreshCw, Settings, Award } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { usePlayoffBracket, useGerarPlayoffs, useResetarPlayoffs, useSuperliga, useConferencias } from '@/hooks/useSuperliga'

// Tipagens corretas baseadas no backend
interface PlayoffJogo {
  id: number
  campeonatoId: number
  conferenciaId?: number
  fase: string
  rodada: number
  nome: string
  timeClassificado1Id?: number
  timeClassificado2Id?: number
  timeVencedorId?: number
  dataJogo?: string
  status: string
  placarTime1?: number
  placarTime2?: number
  observacoes?: string
  timeClassificado1?: {
    id: number
    nome: string
    sigla: string
    logo: string
  }
  timeClassificado2?: {
    id: number
    nome: string
    sigla: string
    logo: string
  }
  timeVencedor?: {
    id: number
    nome: string
    sigla: string
    logo: string
  }
  conferencia?: {
    id: number
    nome: string
    tipo: string
    icone: string
  }
}

interface SuperligaData {
  id: number
  nome: string
  temporada: string
  status: string
}

interface ConferenciaData {
  id: number
  nome: string
  tipo: string
  icone: string
  ordem: number
  totalTimes: number
}

export default function PlayoffsPage() {
  const params = useParams()
  const superligaId = params.id as string
  const [selectedConferencia, setSelectedConferencia] = useState<string>('all')
  const [selectedFase, setSelectedFase] = useState<string>('all')

  const { data: superliga, isLoading: loadingSuperliga } = useSuperliga(superligaId)
  const { data: bracket, isLoading: loadingBracket, refetch } = usePlayoffBracket(superligaId)
  const { data: conferencias, isLoading: loadingConferencias } = useConferencias(superligaId)
  const { mutate: gerarPlayoffs, isPending: gerandoPlayoffs } = useGerarPlayoffs()
  const { mutate: resetarPlayoffs, isPending: resetandoPlayoffs } = useResetarPlayoffs()

  const isLoading = loadingSuperliga || loadingBracket || loadingConferencias

  if (isLoading) {
    return <Loading />
  }

  const superligaData = superliga as SuperligaData
  const playoffJogos = bracket as PlayoffJogo[]
  const conferenciasData = conferencias as ConferenciaData[]

  const handleGerarPlayoffs = () => {
    gerarPlayoffs(superligaData.temporada, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleResetarPlayoffs = () => {
    if (confirm('Tem certeza que deseja resetar todos os playoffs? Esta ação não pode ser desfeita.')) {
      resetarPlayoffs(superligaData.temporada, {
        onSuccess: () => {
          refetch()
        }
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'AO_VIVO':
        return <Play className="w-4 h-4 text-red-500" />
      case 'AGENDADO':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'AO_VIVO': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'AGENDADO': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'AGUARDANDO': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'Finalizado'
      case 'AO_VIVO': return 'Ao Vivo'
      case 'AGENDADO': return 'Agendado'
      case 'AGUARDANDO': return 'Aguardando'
      default: return status
    }
  }

  const getFaseLabel = (fase: string) => {
    switch (fase) {
      case 'WILD_CARD': return 'Wild Card'
      case 'SEMIFINAL': return 'Semifinal'
      case 'FINAL': return 'Final'
      case 'SEMIFINAL_NACIONAL': return 'Semifinal Nacional'
      case 'FINAL_NACIONAL': return 'Final Nacional'
      default: return fase
    }
  }

  const getConferenciaIcon = (tipo: string) => {
    switch (tipo) {
      case 'SUDESTE': return '🏭'
      case 'SUL': return '🧊'
      case 'NORDESTE': return '🌵'
      case 'CENTRO_NORTE': return '🌲'
      default: return '⚽'
    }
  }

  // Filtrar jogos
  const jogosFiltrados = playoffJogos?.filter(jogo => {
    const conferenciaMatch = selectedConferencia === 'all' || 
      jogo.conferencia?.tipo === selectedConferencia ||
      (selectedConferencia === 'nacional' && !jogo.conferenciaId)
    
    const faseMatch = selectedFase === 'all' || jogo.fase === selectedFase
    
    return conferenciaMatch && faseMatch
  }) || []

  // Agrupar por conferência
  const jogosPorConferencia = jogosFiltrados.reduce((acc, jogo) => {
    const key = jogo.conferencia?.tipo || 'nacional'
    if (!acc[key]) acc[key] = []
    acc[key].push(jogo)
    return acc
  }, {} as Record<string, PlayoffJogo[]>)

  // Estatísticas
  const stats = {
    total: playoffJogos?.length || 0,
    finalizados: playoffJogos?.filter(j => j.status === 'FINALIZADO').length || 0,
    emAndamento: playoffJogos?.filter(j => j.status === 'AO_VIVO').length || 0,
    agendados: playoffJogos?.filter(j => j.status === 'AGENDADO').length || 0
  }

  const renderJogoCard = (jogo: PlayoffJogo) => (
    <div key={jogo.id} className="bg-[#272731] rounded-lg border border-gray-700 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {jogo.conferencia && (
            <span className="text-lg">{getConferenciaIcon(jogo.conferencia.tipo)}</span>
          )}
          <div>
            <h4 className="text-white font-medium text-sm">{jogo.nome}</h4>
            <p className="text-gray-400 text-xs">{getFaseLabel(jogo.fase)} - Rodada {jogo.rodada}</p>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded border text-xs ${getStatusColor(jogo.status)}`}>
          <div className="flex items-center gap-1">
            {getStatusIcon(jogo.status)}
            {getStatusLabel(jogo.status)}
          </div>
        </div>
      </div>

      {/* Times */}
      <div className="space-y-2">
        {/* Time 1 */}
        <div className="flex items-center justify-between p-2 bg-[#1C1C24] rounded">
          <div className="flex items-center gap-2">
            {jogo.timeClassificado1 ? (
              <>
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {jogo.timeClassificado1.sigla}
                  </span>
                </div>
                <span className="text-white text-sm">{jogo.timeClassificado1.nome}</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">Aguardando</span>
            )}
          </div>
          
          {jogo.status === 'FINALIZADO' && jogo.placarTime1 !== undefined && (
            <span className={`text-sm font-bold ${
              jogo.timeVencedor?.id === jogo.timeClassificado1?.id ? 'text-[#63E300]' : 'text-gray-400'
            }`}>
              {jogo.placarTime1}
            </span>
          )}
        </div>

        {/* Time 2 */}
        <div className="flex items-center justify-between p-2 bg-[#1C1C24] rounded">
          <div className="flex items-center gap-2">
            {jogo.timeClassificado2 ? (
              <>
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {jogo.timeClassificado2.sigla}
                  </span>
                </div>
                <span className="text-white text-sm">{jogo.timeClassificado2.nome}</span>
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">Aguardando</span>
            )}
          </div>
          
          {jogo.status === 'FINALIZADO' && jogo.placarTime2 !== undefined && (
            <span className={`text-sm font-bold ${
              jogo.timeVencedor?.id === jogo.timeClassificado2?.id ? 'text-[#63E300]' : 'text-gray-400'
            }`}>
              {jogo.placarTime2}
            </span>
          )}
        </div>
      </div>

      {/* Vencedor */}
      {jogo.status === 'FINALIZADO' && jogo.timeVencedor && (
        <div className="mt-2 p-2 bg-[#63E300]/10 border border-[#63E300]/20 rounded">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#63E300]" />
            <span className="text-[#63E300] text-xs font-medium">
              Vencedor: {jogo.timeVencedor.nome}
            </span>
          </div>
        </div>
      )}

      {/* Data */}
      {jogo.dataJogo && (
        <div className="mt-2 text-xs text-gray-400">
          {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  )

  const renderConferenciaSection = (tipo: string, jogos: PlayoffJogo[]) => {
    const conferencia = conferenciasData?.find(c => c.tipo === tipo)
    const nome = tipo === 'nacional' ? 'Fase Nacional' : conferencia?.nome || tipo
    const icone = tipo === 'nacional' ? '🏆' : getConferenciaIcon(tipo)

    // Agrupar por fase
    const jogosPorFase = jogos.reduce((acc, jogo) => {
      if (!acc[jogo.fase]) acc[jogo.fase] = []
      acc[jogo.fase].push(jogo)
      return acc
    }, {} as Record<string, PlayoffJogo[]>)

    return (
      <div key={tipo} className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icone}</span>
          <div>
            <h3 className="text-white font-semibold">{nome}</h3>
            <p className="text-gray-400 text-sm">{jogos.length} jogos</p>
          </div>
        </div>

        {Object.entries(jogosPorFase).map(([fase, jogos]) => (
          <div key={fase}>
            <h4 className="text-gray-300 font-medium mb-2 text-sm">{getFaseLabel(fase)}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {jogos.map(renderJogoCard)}
            </div>
          </div>
        ))}
      </div>
    )
  }

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
        
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-orange-500" />
            Playoffs
          </h1>
          <p className="text-gray-400">{superligaData?.nome} - Temporada {superligaData?.temporada}</p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">{stats.total}</p>
            <p className="text-sm text-gray-400">Total de Jogos</p>
          </div>
        </div>
        
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{stats.finalizados}</p>
            <p className="text-sm text-gray-400">Finalizados</p>
          </div>
        </div>
        
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{stats.emAndamento}</p>
            <p className="text-sm text-gray-400">Em Andamento</p>
          </div>
        </div>
        
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.agendados}</p>
            <p className="text-sm text-gray-400">Agendados</p>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filtros */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Conferência</label>
              <select
                value={selectedConferencia}
                onChange={(e) => setSelectedConferencia(e.target.value)}
                className="px-3 py-2 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
              >
                <option value="all">Todas</option>
                <option value="SUDESTE">🏭 Sudeste</option>
                <option value="SUL">🧊 Sul</option>
                <option value="NORDESTE">🌵 Nordeste</option>
                <option value="CENTRO_NORTE">🌲 Centro-Norte</option>
                <option value="nacional">🏆 Nacional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Fase</label>
              <select
                value={selectedFase}
                onChange={(e) => setSelectedFase(e.target.value)}
                className="px-3 py-2 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
              >
                <option value="all">Todas</option>
                <option value="WILD_CARD">Wild Card</option>
                <option value="SEMIFINAL">Semifinal</option>
                <option value="FINAL">Final</option>
                <option value="SEMIFINAL_NACIONAL">Semifinal Nacional</option>
                <option value="FINAL_NACIONAL">Final Nacional</option>
              </select>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            {(!playoffJogos || playoffJogos.length === 0) ? (
              <button
                onClick={handleGerarPlayoffs}
                disabled={gerandoPlayoffs}
                className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {gerandoPlayoffs ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Gerar Playoffs
                  </>
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={handleResetarPlayoffs}
                  disabled={resetandoPlayoffs}
                  className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {resetandoPlayoffs ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Resetar
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => refetch()}
                  className="bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Atualizar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {!playoffJogos || playoffJogos.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Playoffs não configurados</h3>
          <p className="text-gray-400 mb-6">
            Os playoffs serão gerados automaticamente quando a temporada regular for concluída.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(jogosPorConferencia).map(([tipo, jogos]) => 
            renderConferenciaSection(tipo, jogos)
          )}
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="mt-8 bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/superliga/${superligaId}/fase-nacional`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Fase Nacional
          </Link>

          <Link
            href={`/admin/superliga/${superligaId}/status`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Status da Superliga
          </Link>

          <Link
            href={`/superliga/${superligaData?.temporada}`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Visualização Pública
          </Link>
        </div>
      </div>
    </div>
  )
}