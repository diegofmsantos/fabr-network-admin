// src/app/admin/superliga/temporada-regular/page.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Calendar, Filter, Eye, Edit, Plus, Play, 
  CheckCircle, Clock, AlertTriangle, BarChart3, Users,
  Trophy, Target, RefreshCw
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useJogos } from '@/hooks/useJogos'
import { useClassificacaoSuperliga, useSuperliga } from '@/hooks/useSuperliga'

type FilterStatus = 'todos' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO' | 'ADIADO'
type FilterRodada = 'todas' | number

export default function AdminTemporadaRegularPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterRodada, setFilterRodada] = useState<FilterRodada>('todas')
  const [filterConferencia, setFilterConferencia] = useState('todas')
  
  const temporada = '2025'
  
  // ✅ CORREÇÃO: Usar hook correto e adicionar tratamento de erro
  const { data: superliga } = useSuperliga(temporada)
  const { 
    data: jogos = [], 
    isLoading: loadingJogos, 
    error: jogosError,
    refetch 
  } = useJogos({ 
    temporada,
    fase: 'TEMPORADA_REGULAR'
  })
  
  const { 
    data: classificacao, 
    isLoading: loadingClassificacao,
    error: classificacaoError 
  } = useClassificacaoSuperliga(temporada)

  const isLoading = loadingJogos || loadingClassificacao

  // ✅ NOVO: Tratamento de erro específico
  const hasError = jogosError || classificacaoError
  const isEmpty = jogos.length === 0 && !isLoading

  if (isLoading) return <Loading />

  // ✅ NOVO: Tela de erro/vazio mais amigável
  if (hasError || isEmpty) {
    return (
      <div className="min-h-screen bg-[#1C1C24] p-6">
        {/* Header */}
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

        {/* Conteúdo de Estado Vazio */}
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

          {/* Instruções */}
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

  // ✅ Resto do código existente para quando há jogos...
  // Filtrar jogos
  const jogosFiltrados = jogos.filter(jogo => {
    const statusMatch = filterStatus === 'todos' || jogo.status === filterStatus
    const rodadaMatch = filterRodada === 'todas' || jogo.rodada === filterRodada
    const conferenciaMatch = filterConferencia === 'todas' || 
      (jogo as any).conferencia === filterConferencia
    return statusMatch && rodadaMatch && conferenciaMatch
  })

  // Agrupar jogos por rodada
  const jogosPorRodada = jogosFiltrados.reduce((acc, jogo) => {
    const rodada = jogo.rodada
    if (!acc[rodada]) acc[rodada] = []
    acc[rodada].push(jogo)
    return acc
  }, {} as Record<number, typeof jogos>)

  // Calcular estatísticas
  const stats = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosAgendados: jogos.filter(j => j.status === 'AGENDADO').length,
    jogosAoVivo: jogos.filter(j => j.status === 'AO_VIVO').length,
    proximoJogo: jogos.find(j => j.status === 'AGENDADO' && new Date(j.dataJogo) > new Date()),
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/superliga"
          className="p-2 rounded-lg bg-[#272731] border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Temporada Regular</h1>
          <p className="text-gray-400">Gerenciar jogos da temporada regular {temporada}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>

          <Link
            href="/admin/importar"
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Importar Dados
          </Link>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Jogos</p>
              <p className="text-2xl font-bold text-white">{stats.totalJogos}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Finalizados</p>
              <p className="text-2xl font-bold text-green-400">{stats.jogosFinalizados}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Agendados</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.jogosAgendados}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ao Vivo</p>
              <p className="text-2xl font-bold text-red-400">{stats.jogosAoVivo}</p>
            </div>
            <Play className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-white text-sm">Filtros:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="bg-[#1C1C24] text-white border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todos">Todos os status</option>
            <option value="AGENDADO">Agendados</option>
            <option value="AO_VIVO">Ao Vivo</option>
            <option value="FINALIZADO">Finalizados</option>
            <option value="ADIADO">Adiados</option>
          </select>

          <select
            value={filterRodada}
            onChange={(e) => setFilterRodada(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))}
            className="bg-[#1C1C24] text-white border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todas">Todas as rodadas</option>
            {[1, 2, 3, 4].map(rodada => (
              <option key={rodada} value={rodada}>Rodada {rodada}</option>
            ))}
          </select>

          <select
            value={filterConferencia}
            onChange={(e) => setFilterConferencia(e.target.value)}
            className="bg-[#1C1C24] text-white border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="todas">Todas as conferências</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Sul">Sul</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Norte">Centro-Norte</option>
          </select>

          <div className="ml-auto text-sm text-gray-400">
            {jogosFiltrados.length} de {jogos.length} jogos
          </div>
        </div>
      </div>

      {/* Lista de Jogos por Rodada */}
      <div className="space-y-6">
        {Object.entries(jogosPorRodada)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([rodada, jogosRodada]) => (
            <div key={rodada} className="bg-[#272731] rounded-lg border border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  Rodada {rodada}
                  <span className="ml-2 text-sm text-gray-400">
                    ({jogosRodada.length} jogos)
                  </span>
                </h3>
              </div>

              <div className="p-4 space-y-3">
                {jogosRodada.map((jogo) => (
                  <div key={jogo.id} className="bg-[#1C1C24] rounded border border-gray-600 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-white font-medium">{jogo.timeCasa.sigla}</p>
                          <p className="text-xs text-gray-400">Casa</p>
                        </div>
                        
                        <div className="text-center px-4">
                          <p className="text-white font-bold">
                            {jogo.status === 'FINALIZADO' 
                              ? `${jogo.placarCasa} - ${jogo.placarVisitante}`
                              : 'vs'
                            }
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-white font-medium">{jogo.timeVisitante.sigla}</p>
                          <p className="text-xs text-gray-400">Visitante</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          jogo.status === 'FINALIZADO' ? 'bg-green-500/20 text-green-400' :
                          jogo.status === 'AO_VIVO' ? 'bg-red-500/20 text-red-400' :
                          jogo.status === 'AGENDADO' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {jogo.status}
                        </div>

                        <Link
                          href={`/admin/jogos/${jogo.id}`}
                          className="flex items-center gap-1 bg-[#63E300] text-black px-3 py-1 rounded text-xs font-medium hover:bg-[#50B800] transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Ver
                        </Link>
                      </div>
                    </div>

                    {jogo.observacoes && (
                      <div className="mt-2 pt-2 border-t border-gray-600">
                        <p className="text-sm text-gray-400">{jogo.observacoes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Ações Rápidas */}
      <div className="mt-8 bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/importar"
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Importar Resultados
          </Link>

          <Link
            href="/admin/superliga/playoffs"
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Ver Playoffs
          </Link>

          <Link
            href={`/superliga/${temporada}/temporada-regular`}
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