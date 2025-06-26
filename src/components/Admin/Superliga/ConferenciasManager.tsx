"use client"

import React, { useState } from 'react'
import { Users, MapPin, Trophy, Settings, Eye, EyeOff, ChevronDown, ChevronUp, Shuffle, AlertCircle, CheckCircle } from 'lucide-react'
import { useTimes } from '@/hooks/useTimes'
import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { useClassificacao, useGrupos } from '@/hooks/useCampeonatos'

interface ConferenciasManagerProps {
  superligaId: number
  temporada: string
}

export const ConferenciasManager: React.FC<ConferenciasManagerProps> = ({
  superligaId,
  temporada
}) => {
  const [expandedConferencia, setExpandedConferencia] = useState<string | null>('SUDESTE')
  const [showClassificacao, setShowClassificacao] = useState(true)

  const { data: grupos = [], isLoading: loadingGrupos } = useGrupos(superligaId)
  const { data: classificacao = [] } = useClassificacao(superligaId)
  const { data: times = [] } = useTimes(temporada)

  const conferencias = [
    {
      tipo: 'SUDESTE',
      nome: 'Conferência Sudeste',
      icone: '🏭',
      cor: 'bg-orange-500',
      totalTimes: 12,
      regionais: ['Serramar', 'Canastra', 'Cantareira']
    },
    {
      tipo: 'SUL',
      nome: 'Conferência Sul',
      icone: '🧊',
      cor: 'bg-blue-500',
      totalTimes: 8,
      regionais: ['Araucária', 'Pampa']
    },
    {
      tipo: 'NORDESTE',
      nome: 'Conferência Nordeste',
      icone: '🌵',
      cor: 'bg-yellow-500',
      totalTimes: 6,
      regionais: ['Atlântico']
    },
    {
      tipo: 'CENTRO_NORTE',
      nome: 'Conferência Centro-Norte',
      icone: '🌲',
      cor: 'bg-green-500',
      totalTimes: 6,
      regionais: ['Cerrado', 'Amazônia']
    }
  ]

  const gruposPorConferencia = grupos.reduce((acc, grupo) => {
    if (!grupo.regional) return acc

    const regional = grupo.regional
    const conferencia = conferencias.find(c =>
      c.regionais.some(r => regional.nome.includes(r))
    )

    if (conferencia) {
      if (!acc[conferencia.tipo]) acc[conferencia.tipo] = []
      acc[conferencia.tipo].push(grupo)
    }

    return acc
  }, {} as Record<string, any[]>)

  const classificacaoPorGrupo = classificacao.reduce((acc, item) => {
    if (!acc[item.grupoId]) acc[item.grupoId] = []
    acc[item.grupoId].push(item)
    return acc
  }, {} as Record<number, any[]>)

  const TimeCard = ({ time, posicao }: { time: any, posicao: number }) => (
    <div className="flex items-center gap-3 p-3 bg-[#1C1C24] rounded-lg">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
        ${posicao === 1 ? 'bg-yellow-500 text-black' :
          posicao === 2 ? 'bg-gray-400 text-black' :
            posicao === 3 ? 'bg-orange-600 text-white' :
              'bg-gray-600 text-white'}`}>
        {posicao}
      </div>

      <Image
        src={ImageService.getTeamLogo(time.nome)}
        alt={`Logo ${time.nome}`}
        width={32}
        height={32}
        className="rounded"
        onError={(e) => ImageService.handleTeamLogoError(e, time.nome)}
      />

      <div className="flex-1 min-w-0">
        <div className="text-white font-medium truncate">{time.nome}</div>
        <div className="text-gray-400 text-sm">{time.sigla}</div>
      </div>

      {showClassificacao && (
        <div className="text-right">
          <div className="text-white font-medium">{classificacaoPorGrupo[time.grupoId]?.[0]?.pontos || 0}</div>
          <div className="text-gray-400 text-xs">pts</div>
        </div>
      )}
    </div>
  )

  const RegionalCard = ({ grupo }: { grupo: any }) => {
    const timesDoGrupo = grupo.times?.map((gt: any) => gt.time) || []
    const classificacaoGrupo = classificacaoPorGrupo[grupo.id] || []

    return (
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-semibold">{grupo.nome}</h4>
            <p className="text-gray-400 text-sm">{timesDoGrupo.length} times</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {showClassificacao && classificacaoGrupo.length > 0 ? (
            classificacaoGrupo
              .sort((a, b) => a.posicao - b.posicao)
              .map((item, index) => (
                <TimeCard key={item.timeId} time={item.time} posicao={item.posicao} />
              ))
          ) : (
            timesDoGrupo.map((time: any, index: number) => (
              <TimeCard key={time.id} time={time} posicao={index + 1} />
            ))
          )}
        </div>

        {timesDoGrupo.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Nenhum time neste regional</p>
          </div>
        )}
      </div>
    )
  }

  const ConferenciaCard = ({ conferencia }: { conferencia: any }) => {
    const isExpanded = expandedConferencia === conferencia.tipo
    const gruposConferencia = gruposPorConferencia[conferencia.tipo] || []
    const timesTotal = gruposConferencia.reduce((acc, grupo) => acc + (grupo.times?.length || 0), 0)

    return (
      <div className="bg-[#272731] rounded-lg border border-gray-700 overflow-hidden">
        {/* Header da Conferência */}
        <div
          className="p-6 cursor-pointer hover:bg-[#2A2A35] transition-colors"
          onClick={() => setExpandedConferencia(isExpanded ? null : conferencia.tipo)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 ${conferencia.cor} bg-opacity-20 rounded-lg`}>
                <span className="text-2xl">{conferencia.icone}</span>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold">{conferencia.nome}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-gray-400 text-sm">
                    {timesTotal}/{conferencia.totalTimes} times
                  </span>
                  <span className="text-gray-400 text-sm">
                    {gruposConferencia.length} regionais
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {timesTotal === conferencia.totalTimes ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                )}
                <span className={`text-sm ${timesTotal === conferencia.totalTimes ? 'text-green-400' : 'text-yellow-400'}`}>
                  {timesTotal === conferencia.totalTimes ? 'Completa' : 'Incompleta'}
                </span>
              </div>

              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-6 pb-6">
            <div className="border-t border-gray-600 pt-4">
              {gruposConferencia.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {gruposConferencia.map((grupo) => (
                    <RegionalCard key={grupo.id} grupo={grupo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3" />
                  <p>Nenhum regional configurado</p>
                  <p className="text-sm">Execute a distribuição de times</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loadingGrupos) {
    return <Loading />
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold">Gerenciar Conferências</h3>
            <p className="text-gray-400 text-sm">
              Visualize e gerencie a distribuição dos 32 times nas 4 conferências
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowClassificacao(!showClassificacao)}
              className="flex items-center gap-2 px-3 py-2 bg-[#1C1C24] text-gray-300 rounded-md hover:bg-[#2A2A35] transition-colors"
            >
              {showClassificacao ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showClassificacao ? 'Ocultar' : 'Mostrar'} Classificação
            </button>

            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Shuffle className="w-4 h-4" />
              Redistribuir Times
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">32</div>
          <div className="text-gray-400 text-sm">Times Total</div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-[#63E300]">4</div>
          <div className="text-gray-400 text-sm">Conferências</div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">8</div>
          <div className="text-gray-400 text-sm">Regionais</div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Object.values(gruposPorConferencia).flat().reduce((acc, g) => acc + (g.times?.length || 0), 0)}
          </div>
          <div className="text-gray-400 text-sm">Times Distribuídos</div>
        </div>
      </div>

      <div className="space-y-4">
        {conferencias.map((conferencia) => (
          <ConferenciaCard key={conferencia.tipo} conferencia={conferencia} />
        ))}
      </div>

      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Ações em Lote</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-3 bg-[#63E300] bg-opacity-20 text-[#63E300] rounded-lg hover:bg-opacity-30 transition-colors">
            <CheckCircle className="w-4 h-4" />
            Validar Distribuição
          </button>

          <button className="flex items-center justify-center gap-2 p-3 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg hover:bg-opacity-30 transition-colors">
            <Shuffle className="w-4 h-4" />
            Redistribuir Automaticamente
          </button>

          <button className="flex items-center justify-center gap-2 p-3 bg-purple-500 bg-opacity-20 text-purple-400 rounded-lg hover:bg-opacity-30 transition-colors">
            <Trophy className="w-4 h-4" />
            Gerar Classificação
          </button>
        </div>
      </div>
    </div>
  )
}