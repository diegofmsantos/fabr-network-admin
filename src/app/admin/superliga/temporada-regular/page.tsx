"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Plus, AlertTriangle, RefreshCw } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useClassificacaoSuperliga, useJogosSuperliga, useSuperliga } from '@/hooks/useSuperliga'
import { TemporadaRegularHeader } from '@/components/Temporada-Regular/TemporadaRegularHeader'
import { TemporadaRegularFilters } from '@/components/Temporada-Regular/TemporadaRegularFilters'
import { TemporadaRegularContent } from '@/components/Temporada-Regular/TemporadaRegularContent'

type FilterStatus = 'todos' | 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
export type FilterRodada = 'todas' | number

export default function AdminTemporadaRegularPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterRodada, setFilterRodada] = useState<FilterRodada>('todas')
  const [filterConferencia, setFilterConferencia] = useState('todas')

  const temporada = '2025'
  
  const { data: superliga, isLoading: loadingSuperliga, error: superligaError } = useSuperliga(temporada)

  const { 
    data: jogos = [], 
    isLoading: loadingJogos, 
    error: jogosError,
    refetch
  } = useJogosSuperliga(temporada, { 
    fase: 'TEMPORADA REGULAR'
  }) as { data: any[], isLoading: boolean, error: any, refetch: () => void }

  const {
    data: classificacao,
    isLoading: loadingClassificacao,
    error: classificacaoError
  } = useClassificacaoSuperliga(temporada)

  const isLoading = loadingJogos || loadingClassificacao || loadingSuperliga

  const hasError = jogosError || classificacaoError || superligaError
  const isEmpty = jogos.length === 0 && !isLoading

  if (loadingSuperliga || loadingJogos || loadingClassificacao) {
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
            <h1 className="text-2xl font-bold text-white">Temporada Regular</h1>
            <p className="text-gray-400">Gerenciar jogos da temporada regular {temporada}</p>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Superliga {temporada} não encontrada</h3>
          <p className="text-gray-400 mb-6">
            A Superliga para a temporada {temporada} ainda não foi criada.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/admin/superliga/criar"
              className="bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              Criar Superliga {temporada}
            </Link>
            <Link
              href="/admin/superliga"
              className="bg-[#272731] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (hasError || isEmpty) {
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
            <h1 className="text-2xl font-bold text-white">Temporada Regular</h1>
            <p className="text-gray-400">Gerenciar jogos da temporada regular {temporada}</p>
          </div>
        </div>

        <div className="text-center py-12">
          {hasError ? (
            <>
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Erro ao carregar dados</h3>
              <p className="text-gray-400 mb-6">
                Não foi possível carregar os dados da temporada regular.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Possíveis causas:
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Superliga não foi criada ainda</li>
                  <li>• Agenda de jogos não foi importada</li>
                  <li>• Erro de conexão com o servidor</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
              <p className="text-gray-400 mb-6">
                A agenda de jogos ainda não foi importada para a temporada {temporada}.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>

            <Link
              href="/admin/importar"
              className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Importar Agenda
            </Link>

            <Link
              href="/admin/superliga"
              className="flex items-center gap-2 bg-[#272731] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>

          <div className="mt-8 bg-[#272731] rounded-lg border border-gray-700 p-6 max-w-2xl mx-auto">
            <h4 className="text-white font-semibold mb-3">Para configurar a temporada regular:</h4>
            <ol className="text-gray-300 text-sm space-y-2 text-left">
              <li>1. Importe os times (se ainda não fez)</li>
              <li>2. Importe os jogadores</li>
              <li>3. Crie a Superliga</li>
              <li>4. Importe a agenda de jogos</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  const jogosFiltrados = jogos.filter(jogo => {
    const statusMatch = filterStatus === 'todos' || jogo.status === filterStatus
    const rodadaMatch = filterRodada === 'todas' || jogo.rodada === filterRodada
    const conferenciaMatch = filterConferencia === 'todas' || 
      (jogo as any).conferencia === filterConferencia
    return statusMatch && rodadaMatch && conferenciaMatch
  })

  const jogosPorRodada = jogosFiltrados.reduce((acc, jogo) => {
    const rodada = jogo.rodada
    if (!acc[rodada]) acc[rodada] = []
    acc[rodada].push(jogo)
    return acc
  }, {} as Record<number, typeof jogos>)

  const stats = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosAgendados: jogos.filter(j => j.status === 'AGENDADO').length,
    jogosAoVivo: jogos.filter(j => j.status === 'AO VIVO').length,
    proximoJogo: jogos.find(j => j.status === 'AGENDADO' && new Date(j.dataJogo) > new Date()),
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <TemporadaRegularHeader 
        temporada={temporada}
        stats={stats}
        onRefresh={() => refetch()}
      />
      
      <TemporadaRegularFilters
        filterStatus={filterStatus}
        filterRodada={filterRodada}
        filterConferencia={filterConferencia}
        onStatusChange={setFilterStatus}
        onRodadaChange={setFilterRodada}
        onConferenciaChange={setFilterConferencia}
        jogos={jogos}
      />

      <TemporadaRegularContent
        jogosPorRodada={jogosPorRodada}
        jogosFiltrados={jogosFiltrados}
        onRefresh={() => refetch()}
      />
    </div>
  )
}
