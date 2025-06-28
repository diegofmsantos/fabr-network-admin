"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Play, Edit3, Eye, Calendar, CheckCircle, Clock, Zap } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useGerarPlayoffs } from '@/hooks/useSuperliga'

interface JogoPlayoff {
  id: number
  nome: string
  fase: string
  timeClassificado1?: { id: number; nome: string; sigla: string }
  timeClassificado2?: { id: number; nome: string; sigla: string }
  timeVencedor?: { id: number; nome: string; sigla: string }
  dataJogo?: string
  status: string
  placarTime1?: number
  placarTime2?: number
}

export default function PlayoffsManagerPage() {
  const params = useParams()
  const superligaId = parseInt(params.id as string)

  const [conferenciaAtiva, setConferenciaAtiva] = useState<string>('SUDESTE')
  const [jogoEditando, setJogoEditando] = useState<number | null>(null)
  const [placarForm, setPlacarForm] = useState({ time1: '', time2: '' })

  const { data: bracketsData, isLoading, refetch } = useBracketPlayoffs(superligaId)
  const brackets = Array.isArray(bracketsData) ? bracketsData : []
  const { mutate: gerarPlayoffs, isPending: gerandoPlayoffs } = useGerarPlayoffs()
  const { mutate: atualizarResultado } = useAtualizarResultadoPlayoff()
  const { mutate: finalizarJogo } = useFinalizarJogoPlayoff()

  const conferencias = [
    { tipo: 'SUDESTE', nome: 'Sudeste', icone: '🏭', cor: 'from-orange-500 to-red-500' },
    { tipo: 'SUL', nome: 'Sul', icone: '🧊', cor: 'from-blue-500 to-cyan-500' },
    { tipo: 'NORDESTE', nome: 'Nordeste', icone: '🌵', cor: 'from-yellow-500 to-amber-500' },
    { tipo: 'CENTRO_NORTE', nome: 'Centro-Norte', icone: '🌲', cor: 'from-green-500 to-emerald-500' }
  ]

  const handleGerarPlayoffs = () => {
    gerarPlayoffs(superligaId, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleEditarPlacar = (jogo: JogoPlayoff) => {
    setJogoEditando(jogo.id)
    setPlacarForm({
      time1: jogo.placarTime1?.toString() || '',
      time2: jogo.placarTime2?.toString() || ''
    })
  }

  const handleSalvarPlacar = (jogoId: number) => {
    const placarTime1 = parseInt(placarForm.time1)
    const placarTime2 = parseInt(placarForm.time2)

    if (isNaN(placarTime1) || isNaN(placarTime2)) return

    atualizarResultado({
      jogoId,
      placarTime1,
      placarTime2
    }, {
      onSuccess: () => {
        setJogoEditando(null)
        refetch()
      }
    })
  }

  const handleFinalizarJogo = (jogoId: number) => {
    finalizarJogo(jogoId, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const getStatusJogo = (jogo: JogoPlayoff) => {
    switch (jogo.status) {
      case 'AGUARDANDO':
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Aguardando' }
      case 'AGENDADO':
        return { icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Agendado' }
      case 'AO_VIVO':
        return { icon: Play, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Ao Vivo' }
      case 'FINALIZADO':
        return { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Finalizado' }
      default:
        return { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Indefinido' }
    }
  }

  const renderJogoCard = (jogo: JogoPlayoff) => {
    const statusInfo = getStatusJogo(jogo)
    const StatusIcon = statusInfo.icon
    const isEditando = jogoEditando === jogo.id

    return (
      <div key={jogo.id} className="bg-[#1C1C24] rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded ${statusInfo.bg}`}>
              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">{jogo.nome}</h4>
              <div className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</div>
            </div>
          </div>

          <div className="flex gap-2">
            {jogo.status !== 'FINALIZADO' && (
              <button
                onClick={() => handleEditarPlacar(jogo)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {jogo.timeClassificado1?.sigla || '?'}
                </span>
              </div>
              <span className="text-white text-sm">
                {jogo.timeClassificado1?.nome || 'A definir'}
              </span>
            </div>

            <div className="text-right">
              {isEditando ? (
                <input
                  type="number"
                  value={placarForm.time1}
                  onChange={(e) => setPlacarForm(prev => ({ ...prev, time1: e.target.value }))}
                  className="w-12 h-8 text-center bg-gray-700 text-white rounded border border-gray-600 focus:border-[#63E300] focus:outline-none"
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {jogo.placarTime1 ?? '-'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {jogo.timeClassificado2?.sigla || '?'}
                </span>
              </div>
              <span className="text-white text-sm">
                {jogo.timeClassificado2?.nome || 'A definir'}
              </span>
            </div>

            <div className="text-right">
              {isEditando ? (
                <input
                  type="number"
                  value={placarForm.time2}
                  onChange={(e) => setPlacarForm(prev => ({ ...prev, time2: e.target.value }))}
                  className="w-12 h-8 text-center bg-gray-700 text-white rounded border border-gray-600 focus:border-[#63E300] focus:outline-none"
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {jogo.placarTime2 ?? '-'}
                </span>
              )}
            </div>
          </div>
        </div>

        {jogo.timeVencedor && (
          <div className="mt-3 p-2 bg-green-500/10 rounded border border-green-500/30">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Vencedor: {jogo.timeVencedor.nome}
              </span>
            </div>
          </div>
        )}

        {isEditando && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleSalvarPlacar(jogo.id)}
              className="flex-1 bg-[#63E300] text-black py-2 px-3 rounded text-sm font-medium hover:bg-[#50B800] transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={() => setJogoEditando(null)}
              className="px-3 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {jogo.status === 'AO_VIVO' && jogo.placarTime1 !== null && jogo.placarTime2 !== null && (
          <button
            onClick={() => handleFinalizarJogo(jogo.id)}
            className="mt-3 w-full bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Finalizar Jogo
          </button>
        )}

        {jogo.dataJogo && (
          <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  const bracketAtivo = brackets?.find(b => b.conferencia === conferenciaAtiva)

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <div className="mb-8">
        <Link
          href={`/admin/superliga/${superligaId}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Painel
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciador de Playoffs</h1>
            <p className="text-gray-400">Gerencie o chaveamento e resultados dos playoffs</p>
          </div>

          {!brackets || brackets.length === 0 ? (
            <button
              onClick={handleGerarPlayoffs}
              disabled={gerandoPlayoffs}
              className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50"
            >
              <Zap className="w-5 h-5" />
              {gerandoPlayoffs ? 'Gerando...' : 'Gerar Playoffs'}
            </button>
          ) : (
            <div className="flex gap-3">
              <Link
                href={`/superliga/${new Date().getFullYear() + 1}/playoffs`}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Ver Público
              </Link>
            </div>
          )}
        </div>
      </div>

      {!brackets || brackets.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Playoffs ainda não foram gerados</h3>
          <p className="text-gray-400 mb-6">
            Os playoffs serão gerados automaticamente quando a temporada regular terminar
          </p>

          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-white mb-3">Pré-requisitos:</h4>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Temporada regular finalizada
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Todos os jogos com resultado
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Classificação definida
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {conferencias.map((conf) => (
                <button
                  key={conf.tipo}
                  onClick={() => setConferenciaAtiva(conf.tipo)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg border transition-all ${conferenciaAtiva === conf.tipo
                      ? 'border-[#63E300] bg-[#63E300]/10 text-white'
                      : 'border-gray-700 bg-[#272731] text-gray-300 hover:border-gray-600'
                    }`}
                >
                  <span className="text-xl">{conf.icone}</span>
                  <div className="text-left">
                    <div className="font-semibold">{conf.nome}</div>
                    <div className="text-xs opacity-80">
                      {brackets.find(b => b.conferencia === conf.tipo)?.wildcards?.length || 0} jogos
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {bracketAtivo && (
            <div className="space-y-8">
              {bracketAtivo.wildcards && bracketAtivo.wildcards.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Wild Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bracketAtivo.wildcards.map((jogo: any) => renderJogoCard(jogo))}
                  </div>
                </div>
              )}

              {bracketAtivo.semifinais && bracketAtivo.semifinais.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Semifinais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bracketAtivo.semifinais.map((jogo: any) => renderJogoCard(jogo))}
                  </div>
                </div>
              )}

              {bracketAtivo.final && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Final da Conferência</h3>
                  <div className="max-w-md mx-auto">
                    {renderJogoCard(bracketAtivo.final)}
                  </div>
                </div>
              )}

              <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
                <h4 className="font-semibold text-white mb-4">Estatísticas da Conferência {conferenciaAtiva}</h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {bracketAtivo.wildcards?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Wild Cards</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      {bracketAtivo.semifinais?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Semifinais</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {bracketAtivo.final ? 1 : 0}
                    </div>
                    <div className="text-sm text-gray-400">Final</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {[
                        ...(bracketAtivo.wildcards || []),
                        ...(bracketAtivo.semifinais || []),
                        ...(bracketAtivo.final ? [bracketAtivo.final] : [])
                      ].filter(j => j.status === 'FINALIZADO').length}
                    </div>
                    <div className="text-sm text-gray-400">Finalizados</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}