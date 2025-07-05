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
import { useClassificacaoSuperliga } from '@/hooks/useSuperliga'

type FilterStatus = 'todos' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO' | 'ADIADO'
type FilterRodada = 'todas' | number

export default function AdminTemporadaRegularPage() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterRodada, setFilterRodada] = useState<FilterRodada>('todas')
  const [filterConferencia, setFilterConferencia] = useState('todas')
  
  const temporada = '2025'
  
  const { data: jogos = [], isLoading: loadingJogos, refetch } = useJogos({ 
    temporada,
    fase: 'TEMPORADA_REGULAR'
  })
  
  const { data: classificacao, isLoading: loadingClassificacao } = useClassificacaoSuperliga(temporada)

  const isLoading = loadingJogos || loadingClassificacao

  if (isLoading) return <Loading />

  // Filtrar jogos
  const jogosFiltrados = jogos.filter(jogo => {
    const statusMatch = filterStatus === 'todos' || jogo.status === filterStatus
    const rodadaMatch = filterRodada === 'todas' || jogo.rodada === filterRodada
    const conferenciaMatch = filterConferencia === 'todas' || 
      (jogo as any).conferencia === filterConferencia // Cast temporário até corrigir o tipo
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
    rodadasTotal: Math.max(...jogos.map(j => j.rodada), 0),
    rodadaAtual: jogos.find(j => j.status === 'AO_VIVO')?.rodada || 
                 Math.min(...jogos.filter(j => j.status === 'AGENDADO').map(j => j.rodada)) || 1
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'AO_VIVO': return <Play className="w-4 h-4 text-red-400" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'ADIADO': return <AlertTriangle className="w-4 h-4 text-orange-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado'
      case 'AO_VIVO': return 'Ao Vivo'
      case 'FINALIZADO': return 'Finalizado'
      case 'ADIADO': return 'Adiado'
      default: return status
    }
  }

  const conferencias = ['SUDESTE', 'SUL', 'NORDESTE', 'CENTRO_NORTE']

  return (
    <div className="space-y-6">
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
          <p className="text-gray-400">
            Gerencie os jogos da temporada regular {temporada}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/jogos"
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Agenda Completa
          </Link>
          
          <Link
            href="/admin/superliga/playoffs"
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Gerar Playoffs
          </Link>
        </div>
      </div>

      {/* Estatísticas da Temporada */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.totalJogos}</div>
              <div className="text-sm text-gray-400">Total de Jogos</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.jogosFinalizados}</div>
              <div className="text-sm text-gray-400">Finalizados</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.jogosAgendados}</div>
              <div className="text-sm text-gray-400">Agendados</div>
            </div>
          </div>
        </div>

        <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{stats.rodadaAtual}/{stats.rodadasTotal}</div>
              <div className="text-sm text-gray-400">Rodada Atual</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
            >
              <option value="todos">Todos os Status</option>
              <option value="AGENDADO">Agendados</option>
              <option value="AO_VIVO">Ao Vivo</option>
              <option value="FINALIZADO">Finalizados</option>
              <option value="ADIADO">Adiados</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Rodada</label>
            <select
              value={filterRodada}
              onChange={(e) => setFilterRodada(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))}
              className="bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
            >
              <option value="todas">Todas as Rodadas</option>
              {Array.from({ length: stats.rodadasTotal }, (_, i) => (
                <option key={i + 1} value={i + 1}>Rodada {i + 1}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Conferência</label>
            <select
              value={filterConferencia}
              onChange={(e) => setFilterConferencia(e.target.value)}
              className="bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
            >
              <option value="todas">Todas as Conferências</option>
              {conferencias.map(conf => (
                <option key={conf} value={conf}>{conf}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus('todos')
                setFilterRodada('todas')
                setFilterConferencia('todas')
              }}
              className="flex items-center gap-2 bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white text-sm hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Progresso da Temporada */}
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Progresso da Temporada</h3>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Jogos Finalizados</span>
            <span className="text-sm text-white">
              {stats.jogosFinalizados} de {stats.totalJogos} ({Math.round((stats.jogosFinalizados / stats.totalJogos) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-[#1C1C24] rounded-full h-2">
            <div 
              className="bg-[#63E300] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.jogosFinalizados / stats.totalJogos) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">{stats.jogosFinalizados}</div>
            <div className="text-xs text-gray-400">Finalizados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{stats.jogosAoVivo}</div>
            <div className="text-xs text-gray-400">Ao Vivo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">{stats.jogosAgendados}</div>
            <div className="text-xs text-gray-400">Agendados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">{stats.rodadaAtual}</div>
            <div className="text-xs text-gray-400">Rodada Atual</div>
          </div>
        </div>
      </div>

      {/* Lista de Jogos por Rodada */}
      <div className="space-y-6">
        {Object.entries(jogosPorRodada)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([rodada, jogosRodada]) => (
            <div key={rodada} className="bg-[#272731] rounded-lg border border-gray-700">
              {/* Header da Rodada */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-white">Rodada {rodada}</h3>
                  <p className="text-sm text-gray-400">
                    {jogosRodada.length} jogos • {jogosRodada.filter(j => j.status === 'FINALIZADO').length} finalizados
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    jogosRodada.every(j => j.status === 'FINALIZADO') 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {jogosRodada.every(j => j.status === 'FINALIZADO') ? 'Concluída' : 'Em Andamento'}
                  </span>
                </div>
              </div>

              {/* Jogos da Rodada */}
              <div className="p-4">
                <div className="space-y-3">
                  {jogosRodada.map(jogo => (
                    <div key={jogo.id} className="flex items-center gap-4 p-3 bg-[#1C1C24] rounded-lg">
                      {/* Status */}
                      <div className="flex items-center gap-2 min-w-[100px]">
                        {getStatusIcon(jogo.status)}
                        <span className="text-xs text-gray-400">
                          {getStatusLabel(jogo.status)}
                        </span>
                      </div>

                      {/* Times */}
                      <div className="flex-1 flex items-center justify-center gap-4">
                        <div className="text-right min-w-[200px]">
                          <div className="text-white font-medium">{jogo.timeCasa.nome}</div>
                          <div className="text-xs text-gray-400">{jogo.timeCasa.sigla}</div>
                        </div>
                        
                        <div className="flex items-center gap-2 min-w-[80px] justify-center">
                          {jogo.status === 'FINALIZADO' ? (
                            <div className="text-lg font-bold text-white">
                              {jogo.placarCasa} - {jogo.placarVisitante}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">VS</div>
                          )}
                        </div>
                        
                        <div className="text-left min-w-[200px]">
                          <div className="text-white font-medium">{jogo.timeVisitante.nome}</div>
                          <div className="text-xs text-gray-400">{jogo.timeVisitante.sigla}</div>
                        </div>
                      </div>

                      {/* Data e Ações */}
                      <div className="text-right min-w-[150px]">
                        <div className="text-sm text-gray-300">
                          {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(jogo.dataJogo).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/jogos/${jogo.id}`}
                          className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        
                        {jogo.status === 'AGENDADO' && (
                          <Link
                            href={`/admin/jogos/${jogo.id}/resultado`}
                            className="p-2 text-green-400 hover:text-green-300 transition-colors"
                            title="Inserir resultado"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        }

        {jogosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
            <p className="text-gray-400 mb-6">
              Ajuste os filtros ou verifique se a agenda foi importada
            </p>
            <Link
              href="/admin/importar"
              className="inline-flex items-center bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Importar Agenda
            </Link>
          </div>
        )}
      </div>

      {/* Ações da Temporada Regular */}
      {stats.jogosFinalizados === stats.totalJogos && stats.totalJogos > 0 && (
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-2">
                Temporada Regular Concluída!
              </h3>
              <p className="text-gray-300">
                Todos os jogos da temporada regular foram finalizados. 
                Agora você pode gerar os playoffs.
              </p>
            </div>
            
            <Link
              href="/admin/superliga/playoffs"
              className="flex items-center gap-2 bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
            >
              <Trophy className="w-5 h-5" />
              Gerar Playoffs
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}