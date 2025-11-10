"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trophy, AlertTriangle, RefreshCw, Plus } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useJogosSuperliga, useSuperliga } from '@/hooks/useSuperliga'
import { Jogo } from '@/hooks/useJogos'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type FilterStatus = 'todos' | 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
type FilterFase = 'todas' | 'WILD CARD' | 'SEMIFINAL DE CONFERÊNCIA' | 'FINAL DE CONFERÊNCIA' | 'SEMIFINAL NACIONAL' | 'FINAL NACIONAL'

export default function AdminPlayoffsPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterFase, setFilterFase] = useState<FilterFase>('todas')
  const [filterConferencia, setFilterConferencia] = useState('todas')

  const temporada = '2025'

  const { data: superliga, isLoading: loadingSuperliga } = useSuperliga(temporada)

  const {
    data: jogosData,
    isLoading: loadingJogos,
    error: jogosError,
    refetch
  } = useJogosSuperliga(temporada, {
    fase: undefined
  })

  const jogos = useMemo(() => {
    if (!jogosData || !Array.isArray(jogosData)) return []

    const jogosArray = (jogosData as any).jogos || jogosData

    return jogosArray.filter((jogo: Jogo) =>
      jogo.fase && jogo.fase !== 'TEMPORADA REGULAR'
    )
  }, [jogosData])

  const isLoading = loadingJogos || loadingSuperliga

  if (loadingSuperliga || loadingJogos) {
    return <Loading />
  }

  if (!superliga && !loadingSuperliga) {
    return (
      <div className="min-h-screen bg-[#1C1C24] p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/superliga"
            className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-white">Playoffs</h1>
            <p className="text-gray-400">Gerenciar jogos dos playoffs {temporada}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Superliga {temporada} não encontrada</h3>
          <p className="text-gray-400 mb-6">
            A Superliga para a temporada {temporada} ainda não foi criada.
          </p>
          <Link
            href="/admin/superliga/criar"
            className="inline-flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
          >
            Criar Superliga {temporada}
          </Link>
        </div>
      </div>
    )
  }

  const jogosFiltrados = jogos.filter((jogo: Jogo) => {
    const statusMatch = filterStatus === 'todos' || jogo.status === filterStatus
    const faseMatch = filterFase === 'todas' || jogo.fase === filterFase
    const conferenciaMatch = filterConferencia === 'todas' ||
      (jogo as any).conferencia === filterConferencia
    return statusMatch && faseMatch && conferenciaMatch
  })

  const jogosPorFase = jogosFiltrados.reduce((acc: Record<string, Jogo[]>, jogo: Jogo) => {
    const fase = jogo.fase || 'SEM FASE'
    if (!acc[fase]) acc[fase] = []
    acc[fase].push(jogo)
    return acc
  }, {})

  const fasesOrdenadas = [
    'WILD CARD',
    'SEMIFINAL DE CONFERÊNCIA',
    'FINAL DE CONFERÊNCIA',
    'SEMIFINAL NACIONAL',
    'FINAL NACIONAL'
  ].filter((fase: string) => jogosPorFase[fase])

  const stats = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter((j: Jogo) => j.status === 'FINALIZADO').length,
    jogosAgendados: jogos.filter((j: Jogo) => j.status === 'AGENDADO').length,
    jogosAoVivo: jogos.filter((j: Jogo) => j.status === 'AO VIVO').length,
  }

  const conferenciasDisponiveis = Array.from(
    new Set(jogos.map((jogo: Jogo) => (jogo as any).conferencia).filter((c: any) => Boolean(c)))
  ) as string[]

  const fasesDisponiveis = Array.from(
    new Set(jogos.map((jogo: Jogo) => jogo.fase).filter((f: any) => Boolean(f)))
  ) as string[]

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Playoffs da Superliga {temporada}</h1>
          <p className="text-gray-400">Gerenciar jogos dos playoffs (Wild Card até Final Nacional)</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-[#272731] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>

          <Link
            href="/admin/importar"
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#50B800] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Importar Resultados
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Jogos</p>
              <p className="text-2xl font-bold text-white">{stats.totalJogos}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Finalizados</p>
              <p className="text-2xl font-bold text-white">{stats.jogosFinalizados}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-500 font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Agendados</p>
              <p className="text-2xl font-bold text-white">{stats.jogosAgendados}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-500 font-bold">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ao Vivo</p>
              <p className="text-2xl font-bold text-white">{stats.jogosAoVivo}</p>
            </div>
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-500 font-bold">🔴</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] rounded-lg p-4 border border-gray-700 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="w-5 h-5 text-gray-400" />
          <h3 className="text-white font-semibold">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full bg-[#1C1C24] text-white border border-gray-700 rounded-lg px-3 py-2 focus:border-[#63E300] focus:outline-none"
            >
              <option value="todos">Todos os Status</option>
              <option value="AGENDADO">Agendado</option>
              <option value="AO VIVO">Ao Vivo</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="ADIADO">Adiado</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Fase</label>
            <select
              value={filterFase}
              onChange={(e) => setFilterFase(e.target.value as FilterFase)}
              className="w-full bg-[#1C1C24] text-white border border-gray-700 rounded-lg px-3 py-2 focus:border-[#63E300] focus:outline-none"
            >
              <option value="todas">Todas as Fases</option>
              {fasesDisponiveis.map((fase: string) => (
                <option key={fase} value={fase}>{fase}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Conferência</label>
            <select
              value={filterConferencia}
              onChange={(e) => setFilterConferencia(e.target.value)}
              className="w-full bg-[#1C1C24] text-white border border-gray-700 rounded-lg px-3 py-2 focus:border-[#63E300] focus:outline-none"
            >
              <option value="todas">Todas as Conferências</option>
              {conferenciasDisponiveis.map((conferencia: string) => (
                <option key={conferencia} value={conferencia}>{conferencia}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {jogosFiltrados.length === 0 ? (
        <div className="bg-[#272731] rounded-lg p-8 border border-gray-700 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
          <p className="text-gray-400">
            {jogos.length === 0
              ? 'Os jogos de playoffs ainda não foram importados.'
              : 'Nenhum jogo corresponde aos filtros selecionados.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {fasesOrdenadas.map((fase: string) => {
            const jogosDaFase = jogosPorFase[fase]

            return (
              <div key={fase} className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-[#1C1C24] px-6 py-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      {fase}
                    </h2>
                    <span className="text-sm text-gray-400">
                      {jogosDaFase.length} {jogosDaFase.length === 1 ? 'jogo' : 'jogos'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jogosDaFase.map((jogo: Jogo) => (
                      <JogoCard key={jogo.id} jogo={jogo} onRefresh={refetch} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface JogoCardProps {
  jogo: Jogo
  onRefresh: () => void
}

function JogoCard({ jogo, onRefresh }: JogoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'bg-green-500/20 text-green-500'
      case 'AO VIVO': return 'bg-red-500/20 text-red-500'
      case 'AGENDADO': return 'bg-blue-500/20 text-blue-500'
      case 'ADIADO': return 'bg-yellow-500/20 text-yellow-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'FINALIZADO': return 'Finalizado'
      case 'AO VIVO': return 'Ao Vivo'
      case 'AGENDADO': return 'Agendado'
      case 'ADIADO': return 'Adiado'
      default: return status
    }
  }

  const dataFormatada = format(new Date(jogo.dataJogo), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })

  return (
    <div className="bg-[#1C1C24] rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(jogo.status)}`}>
          {getStatusLabel(jogo.status)}
        </span>
        <span className="text-xs text-gray-400">{dataFormatada}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {jogo.timeCasa ? (
              <>
                <Image
                  src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                  alt={jogo.timeCasa.nome}
                  width={40}
                  height={40}
                  className="rounded-full object-contain"
                />
                <div className="flex-1">
                  <p className="font-bold text-white">{jogo.timeCasa.sigla}</p>
                  <p className="text-xs text-gray-400">{jogo.timeCasa.nome}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">?</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-400">A Definir</p>
                  <p className="text-xs text-gray-500">Aguardando classificação</p>
                </div>
              </>
            )}
          </div>
          <div className="text-2xl font-bold text-white w-12 text-center">
            {jogo.placarCasa ?? '-'}
          </div>
        </div>

        <div className="border-t border-gray-700"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {jogo.timeVisitante ? (
              <>
                <Image
                  src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                  alt={jogo.timeVisitante.nome}
                  width={40}
                  height={40}
                  className="rounded-full object-contain"
                />
                <div className="flex-1">
                  <p className="font-bold text-white">{jogo.timeVisitante.sigla}</p>
                  <p className="text-xs text-gray-400">{jogo.timeVisitante.nome}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">?</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-400">A Definir</p>
                  <p className="text-xs text-gray-500">Aguardando classificação</p>
                </div>
              </>
            )}
          </div>
          <div className="text-2xl font-bold text-white w-12 text-center">
            {jogo.placarVisitante ?? '-'}
          </div>
        </div>
      </div>

      {(jogo.local || (jogo as any).conferencia) && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-xs text-gray-400">
          {jogo.local && <span>📍 {jogo.local}</span>}
          {(jogo as any).conferencia && (
            <span className="bg-gray-700 px-2 py-1 rounded">{(jogo as any).conferencia}</span>
          )}
        </div>
      )}

      <Link
        href={`/admin/jogos/${jogo.id}`}
        className="mt-4 w-full block text-center bg-[#272731] text-white py-2 px-4 rounded-md border border-gray-700 hover:border-[#63E300] hover:text-[#63E300] transition-colors text-sm font-semibold"
      >
        Ver Detalhes
      </Link>
    </div>
  )
}