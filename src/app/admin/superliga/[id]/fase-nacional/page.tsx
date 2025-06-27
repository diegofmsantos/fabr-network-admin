"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Crown, Star, Calendar, Play, Edit3, CheckCircle, Clock, Zap, Eye, Award } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useFaseNacional, useGerarSemifinaisNacionais, useGerarFinalNacional, useAtualizarResultadoPlayoff, useFinalizarJogoPlayoff } from '@/hooks/useSuperliga'

interface JogoNacional {
  id: number
  nome: string
  timeClassificado1?: { id: number; nome: string; sigla: string }
  timeClassificado2?: { id: number; nome: string; sigla: string }
  timeVencedor?: { id: number; nome: string; sigla: string }
  dataJogo?: string
  status: string
  placarTime1?: number
  placarTime2?: number
}

export default function FaseNacionalManagerPage() {
  const params = useParams()
  const superligaId = parseInt(params.id as string)

  const [jogoEditando, setJogoEditando] = useState<number | null>(null)
  const [placarForm, setPlacarForm] = useState({ time1: '', time2: '' })

  const { data: faseNacional, isLoading, refetch } = useFaseNacional(superligaId)
  const { mutate: gerarSemifinais, isPending: gerandoSemifinais } = useGerarSemifinaisNacionais()
  const { mutate: gerarFinal, isPending: gerandoFinal } = useGerarFinalNacional()
  const { mutate: atualizarResultado } = useAtualizarResultadoPlayoff()
  const { mutate: finalizarJogo } = useFinalizarJogoPlayoff()

  const handleGerarSemifinais = () => {
    gerarSemifinais(superligaId, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleGerarFinal = () => {
    gerarFinal(superligaId, {
      onSuccess: () => {
        refetch()
      }
    })
  }

  const handleEditarPlacar = (jogo: JogoNacional) => {
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

  const getStatusJogo = (jogo: JogoNacional) => {
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

  const renderJogoCard = (jogo: JogoNacional, isFinal = false) => {
    const statusInfo = getStatusJogo(jogo)
    const StatusIcon = statusInfo.icon
    const isEditando = jogoEditando === jogo.id

    return (
      <div className={`bg-[#272731] rounded-lg border p-6 ${isFinal ? 'border-[#63E300] shadow-lg' : 'border-gray-700'
        }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${isFinal ? 'bg-[#63E300]/20' : statusInfo.bg}`}>
              {isFinal ? (
                <Crown className="w-6 h-6 text-[#63E300]" />
              ) : (
                <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isFinal ? 'text-[#63E300]' : 'text-white'}`}>
                {jogo.nome}
              </h3>
              <div className={`text-sm ${statusInfo.color}`}>{statusInfo.label}</div>
            </div>
          </div>

          <div className="flex gap-2">
            {jogo.status !== 'FINALIZADO' && (
              <button
                onClick={() => handleEditarPlacar(jogo)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {jogo.timeClassificado1?.sigla || '?'}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold">
                  {jogo.timeClassificado1?.nome || 'A definir'}
                </div>
                <div className="text-xs text-gray-400">
                  {isFinal ? 'Finalista' : 'Semifinalista'}
                </div>
              </div>
            </div>

            <div className="text-right">
              {isEditando ? (
                <input
                  type="number"
                  value={placarForm.time1}
                  onChange={(e) => setPlacarForm(prev => ({ ...prev, time1: e.target.value }))}
                  className="w-16 h-10 text-center bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#63E300] focus:outline-none text-lg font-bold"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {jogo.placarTime1 ?? '-'}
                </span>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="text-gray-500 font-bold">VS</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {jogo.timeClassificado2?.sigla || '?'}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold">
                  {jogo.timeClassificado2?.nome || 'A definir'}
                </div>
                <div className="text-xs text-gray-400">
                  {isFinal ? 'Finalista' : 'Semifinalista'}
                </div>
              </div>
            </div>

            <div className="text-right">
              {isEditando ? (
                <input
                  type="number"
                  value={placarForm.time2}
                  onChange={(e) => setPlacarForm(prev => ({ ...prev, time2: e.target.value }))}
                  className="w-16 h-10 text-center bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-[#63E300] focus:outline-none text-lg font-bold"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {jogo.placarTime2 ?? '-'}
                </span>
              )}
            </div>
          </div>
        </div>

        {jogo.timeVencedor && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[#63E300]/20 to-green-500/20 rounded-lg border border-[#63E300]/30">
            <div className="flex items-center gap-3">
              {isFinal ? (
                <Crown className="w-6 h-6 text-[#63E300]" />
              ) : (
                <Trophy className="w-6 h-6 text-[#63E300]" />
              )}
              <div>
                <div className="text-[#63E300] font-bold">
                  {isFinal ? '🏆 CAMPEÃO NACIONAL!' : '✨ Classificado para a Final!'}
                </div>
                <div className="text-white font-semibold">
                  {jogo.timeVencedor.nome}
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditando && (
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => handleSalvarPlacar(jogo.id)}
              className="flex-1 bg-[#63E300] text-black py-3 px-4 rounded-lg font-semibold hover:bg-[#50B800] transition-colors"
            >
              Salvar Resultado
            </button>
            <button
              onClick={() => setJogoEditando(null)}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}

        {jogo.status === 'AO_VIVO' && jogo.placarTime1 !== null && jogo.placarTime2 !== null && (
          <button
            onClick={() => handleFinalizarJogo(jogo.id)}
            className="mt-4 w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Finalizar Jogo
          </button>
        )}

        {jogo.dataJogo && (
          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
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
            <h1 className="text-3xl font-bold text-white mb-2">Fase Nacional</h1>
            <p className="text-gray-400">Gerencie as semifinais e final nacional da Superliga</p>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/superliga/${new Date().getFullYear() + 1}/final`}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver Público
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-[#63E300]/10 to-green-500/10 rounded-lg border border-[#63E300]/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#63E300]/20 rounded-lg">
            <Crown className="w-8 h-8 text-[#63E300]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {faseNacional?.status === 'FINALIZADO' ? 'Superliga Finalizada!' :
                faseNacional?.status === 'FINAL_NACIONAL' ? 'Final Nacional em Andamento' :
                  'Semifinais Nacionais'}
            </h2>
            <p className="text-gray-300">
              {faseNacional?.final?.timeVencedor ?
                `Campeão: ${faseNacional.final.timeVencedor.nome}` :
                'Os 4 melhores times do Brasil disputam o título nacional'
              }
            </p>
          </div>
        </div>
      </div>

      {!faseNacional || (!faseNacional.semifinais || faseNacional.semifinais.length === 0) ? (
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Semifinais nacionais não foram geradas</h3>
          <p className="text-gray-400 mb-6">
            As semifinais serão geradas quando todas as conferências finalizarem seus playoffs
          </p>

          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 max-w-md mx-auto mb-6">
            <h4 className="font-semibold text-white mb-3">Pré-requisitos:</h4>
            <ul className="text-sm text-gray-300 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Playoffs de todas as 4 conferências finalizados
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Campeões de cada conferência definidos
              </li>
            </ul>
          </div>

          <button
            onClick={handleGerarSemifinais}
            disabled={gerandoSemifinais}
            className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#50B800] transition-colors disabled:opacity-50 mx-auto"
          >
            <Zap className="w-5 h-5" />
            {gerandoSemifinais ? 'Gerando...' : 'Gerar Semifinais Nacionais'}
          </button>
        </div>
      ) : (
        <div className="space-y-8">

          {faseNacional.semifinais && faseNacional.semifinais.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Semifinais Nacionais</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {faseNacional.semifinais.map((jogo) => renderJogoCard(jogo))}
              </div>
            </div>
          )}

          {faseNacional.semifinais?.every(sf => sf.status === 'FINALIZADO') && !faseNacional.final && (
            <div className="text-center py-8">
              <button
                onClick={handleGerarFinal}
                disabled={gerandoFinal}
                className="flex items-center gap-2 bg-[#63E300] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#50B800] transition-colors disabled:opacity-50 mx-auto"
              >
                <Crown className="w-6 h-6" />
                {gerandoFinal ? 'Gerando...' : 'Gerar Final Nacional'}
              </button>
            </div>
          )}

          {faseNacional.final && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🏆 Grande Final Nacional 🏆</h3>
              <div className="max-w-2xl mx-auto">
                {renderJogoCard(faseNacional.final, true)}
              </div>
            </div>
          )}

          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h4 className="font-semibold text-white mb-4">Estatísticas da Fase Nacional</h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {(faseNacional.semifinais?.length || 0) + (faseNacional.final ? 1 : 0)}
                </div>
                <div className="text-sm text-gray-400">Total de Jogos</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {[...faseNacional.semifinais || [], ...(faseNacional.final ? [faseNacional.final] : [])].filter(j => j.status === 'FINALIZADO').length}
                </div>
                <div className="text-sm text-gray-400">Finalizados</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">
                  {faseNacional.semifinais?.length || 0}
                </div>
                <div className="text-sm text-gray-400">Semifinais</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {faseNacional.final ? 1 : 0}
                </div>
                <div className="text-sm text-gray-400">Final</div>
              </div>
            </div>
          </div>

          {faseNacional.final?.timeVencedor && (
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-[#63E300]/20 to-yellow-500/20 rounded-2xl border border-[#63E300]/50 p-8 max-w-lg mx-auto">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Crown className="w-16 h-16 text-[#63E300]" />
                    <div className="absolute -top-2 -right-2">
                      <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-[#63E300] mb-2">
                  CAMPEÃO NACIONAL
                </h2>

                <div className="text-2xl font-bold text-white mb-2">
                  {faseNacional.final.timeVencedor.nome}
                </div>

                <div className="text-gray-300">
                  Superliga de Futebol Americano {new Date().getFullYear() + 1}
                </div>

                <div className="mt-4 flex justify-center">
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}