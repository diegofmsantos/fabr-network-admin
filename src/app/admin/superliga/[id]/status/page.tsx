"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Trophy, Calendar, BarChart3, RefreshCw, Eye, Settings } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useStatusSuperliga, useValidarEstrutura, useFaseNacional } from '@/hooks/useSuperliga'

export default function SuperligaStatusPage() {
  const params = useParams()
  const router = useRouter()
  const superligaId = parseInt(params.id as string)
  const [refreshing, setRefreshing] = useState(false)

  const { data: status, isLoading: loadingStatus, refetch: refetchStatus } = useStatusSuperliga(superligaId)
  const { data: validacao, isLoading: loadingValidacao } = useValidarEstrutura(superligaId)
  const { data: ranking } = useRankingGeral(superligaId)
  const { data: brackets } = useBracketPlayoffs(superligaId)
  const { data: faseNacional } = useFaseNacional(superligaId)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetchStatus()
    setTimeout(() => setRefreshing(false), 1000)
  }

  if (loadingStatus || loadingValidacao) {
    return <Loading />
  }

  if (!status) {
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

  const getFaseStatus = () => {
    switch (status.fase) {
      case 'CONFIGURACAO':
        return { icon: Settings, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Configuração' }
      case 'TEMPORADA_REGULAR':
        return { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Temporada Regular' }
      case 'PLAYOFFS':
        return { icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Playoffs' }
      case 'FINALIZADO':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', label: 'Finalizado' }
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Indefinido' }
    }
  }

  const faseInfo = getFaseStatus()
  const FaseIcon = faseInfo.icon

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
            <h1 className="text-3xl font-bold text-white mb-2">Status da Superliga</h1>
            <p className="text-gray-400">Acompanhe o progresso completo do campeonato</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Fase Atual</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg ${faseInfo.bg}`}>
                  <FaseIcon className={`w-6 h-6 ${faseInfo.color}`} />
                </div>
                <div>
                  <div className={`text-xl font-bold ${faseInfo.color}`}>{faseInfo.label}</div>
                  {status.proximoPasso && (
                    <div className="text-sm text-gray-400">{status.proximoPasso}</div>
                  )}
                </div>
              </div>

              {status.podeAvancar ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Pronto para próxima fase</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Aguardando conclusão da fase atual</span>
                </div>
              )}

              {status.motivos && status.motivos.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="text-yellow-400 font-medium mb-1">Pendências:</div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {status.motivos.map((motivo, index) => (
                      <li key={index}>• {motivo}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {Math.round(((status as any).jogosTemporadaRegular?.percentual || 0))}%
              </div>
              <div className="text-sm text-gray-400">Concluído</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Integridade</h3>

          {validacao ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Estrutura</span>
                {validacao.valida ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                )}
              </div>

              {validacao.erros && validacao.erros.length > 0 && (
                <div className="text-sm">
                  <div className="text-red-400 font-medium">{validacao.erros.length} erros</div>
                  <div className="text-gray-400 mt-1 max-h-20 overflow-y-auto">
                    {validacao.erros.slice(0, 3).map((erro, index) => (
                      <div key={index}>• {erro}</div>
                    ))}
                    {validacao.erros.length > 3 && (
                      <div className="text-gray-500">+{validacao.erros.length - 3} mais...</div>
                    )}
                  </div>
                </div>
              )}

              {validacao.avisos && validacao.avisos.length > 0 && (
                <div className="text-sm">
                  <div className="text-yellow-400 font-medium">{validacao.avisos.length} avisos</div>
                </div>
              )}

              {validacao.valida && (
                <div className="text-sm text-green-400">
                  ✓ Estrutura íntegra
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <div className="text-sm text-gray-400">Verificando...</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white">Temporada Regular</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Jogos</span>
              <span className="text-white font-medium">
                {(status as any).jogosTemporadaRegular?.finalizados || 0}/{(status as any).jogosTemporadaRegular?.total || 0}
              </span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(status as any).jogosTemporadaRegular?.percentual || 0}%` }}
              />
            </div>

            <div className="text-sm text-gray-400">
              {(status as any).jogosTemporadaRegular?.percentual?.toFixed(1) || 0}% concluído
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-white">Playoffs</h4>
          </div>

          <div className="space-y-2">
            {Object.entries((status as any).playoffsStatus || {}).map(([conf, confStatus]) => (
              <div key={conf} className="flex justify-between">
                <span className="text-gray-300 text-sm">
                  {conf === 'SUDESTE' ? '🏭' : conf === 'SUL' ? '🧊' : conf === 'NORDESTE' ? '🌵' : '🌲'}
                  {conf.replace('_', '-')}
                </span>
                <div className="flex gap-1">
                  {(confStatus as any)?.wildcardCompleto && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                  {(confStatus as any)?.semifinalCompleto && <div className="w-2 h-2 bg-blue-400 rounded-full" />}
                  {(confStatus as any)?.finalCompleto && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white">Fase Nacional</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Semifinais</span>
              {(status as any).faseNacionalStatus?.semifinaisCompletas ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-gray-500" />
              )}
            </div>

            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Campeão</span>
              {(status as any).faseNacionalStatus?.campeaoNacional ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <Clock className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h4 className="font-semibold text-white">Estatísticas</h4>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Times</span>
              <span className="text-white font-medium">32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Conferências</span>
              <span className="text-white font-medium">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300 text-sm">Regionais</span>
              <span className="text-white font-medium">8</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href={`/admin/superliga/${superligaId}/playoffs`}
          className="bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-5 h-5 text-orange-400" />
            <h4 className="font-semibold text-white group-hover:text-[#63E300] transition-colors">
              Gerenciar Playoffs
            </h4>
          </div>
          <p className="text-sm text-gray-400">
            Visualize e gerencie o chaveamento dos playoffs
          </p>
        </Link>

        <Link
          href={`/admin/superliga/${superligaId}/fase-nacional`}
          className="bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-white group-hover:text-[#63E300] transition-colors">
              Fase Nacional
            </h4>
          </div>
          <p className="text-sm text-gray-400">
            Acompanhe semifinais e final nacional
          </p>
        </Link>

        <Link
          href={`/superliga/${new Date().getFullYear() + 1}`}
          className="bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <h4 className="font-semibold text-white group-hover:text-[#63E300] transition-colors">
              Visualização Pública
            </h4>
          </div>
          <p className="text-sm text-gray-400">
            Ver como o público visualiza a Superliga
          </p>
        </Link>
      </div>
    </div>
  )
}