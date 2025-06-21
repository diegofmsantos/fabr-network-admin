"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCampeonato, useGerarJogos, useJogos } from '@/hooks/useCampeonatos'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { ArrowLeft, Plus, Calendar, Download, Filter, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import { JogoManager } from '@/components/Admin/JogoManager'

type FilterStatus = 'todos' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO' | 'ADIADO'
type ViewMode = 'calendar' | 'list' | 'table'

export default function AdminJogos() {
  const params = useParams()
  const router = useRouter()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterGrupo, setFilterGrupo] = useState<number | 'todos'>('todos')
  const [filterRodada, setFilterRodada] = useState<number | 'todas'>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJogos, setSelectedJogos] = useState<number[]>([])

  const campeonatoId = parseInt(params.id as string)

  const { data: campeonato, isLoading: loadingCampeonato, error } = useCampeonato(campeonatoId)
  const { data: jogos = [], isLoading: loadingJogos, refetch } = useJogos({ campeonatoId })
  const gerarJogosMutation = useGerarJogos()

  const loading = loadingCampeonato || loadingJogos

  const jogosFiltrados = jogos.filter(jogo => {
    const matchStatus = filterStatus === 'todos' || jogo.status === filterStatus
    const matchGrupo = filterGrupo === 'todos' || jogo.grupoId === filterGrupo
    const matchRodada = filterRodada === 'todas' || jogo.rodada === filterRodada
    const matchSearch = !searchTerm ||
      (jogo.timeCasa.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (jogo.timeVisitante.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

    return matchStatus && matchGrupo && matchRodada && matchSearch
  })

  const handleGerarJogos = async () => {
    if (confirm('Isso irá gerar todos os jogos para este campeonato. Continuar?')) {
      try {
        await gerarJogosMutation.mutateAsync(campeonatoId)
        refetch()
      } catch (error) {
        alert('Erro ao gerar jogos')
      }
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedJogos.length === 0) {
      alert('Selecione ao menos um jogo')
      return
    }
    console.log(`Ação em lote: ${action}`, selectedJogos)
  }

  const handleExport = () => {
    console.log('Exportar jogos:', jogosFiltrados)
  }

  if (loading) return <Loading />
  if (error || !campeonato) {
    return (
      <NoDataFound
        type="campeonato"
        entityName={params.id as string}
        onGoBack={() => router.back()}
        temporada="2025"
      />
    )
  }

  const estadisticas = {
    total: jogos.length,
    agendados: jogos.filter(j => j.status === 'AGENDADO').length,
    finalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    aoVivo: jogos.filter(j => j.status === 'AO_VIVO').length,
    adiados: jogos.filter(j => j.status === 'ADIADO').length,
  }

  const rodadas = [...new Set(jogos.map(j => j.rodada))].sort((a, b) => a - b)

  return (
    <div className="space-y-6">
      <div className="bg-[#272731] shadow rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/admin/campeonatos/${campeonatoId}`}
              className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#63E300]">Gerenciar Jogos</h1>
              <p className="text-sm text-gray-300">
                {campeonato.nome} • {estadisticas.total} jogos
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>

            {estadisticas.total === 0 && (
              <button
                onClick={handleGerarJogos}
                disabled={gerarJogosMutation.isPending}
                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                {gerarJogosMutation.isPending ? 'Gerando...' : 'Gerar Jogos'}
              </button>
            )}

            <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
        <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-300 truncate">Total</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-500">{estadisticas.total}</dd>
          </div>
        </div>

        <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-300 truncate">Agendados</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">{estadisticas.agendados}</dd>
          </div>
        </div>

        <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-300 truncate">Ao Vivo</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">{estadisticas.aoVivo}</dd>
          </div>
        </div>

        <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-300 truncate">Finalizados</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{estadisticas.finalizados}</dd>
          </div>
        </div>

        <div className="bg-[#272731] shadow rounded-lg border border-gray-700">
          <div className="p-5">
            <dt className="text-sm font-medium text-gray-300 truncate">Adiados</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">{estadisticas.adiados}</dd>
          </div>
        </div>
      </div>

      <div className="bg-[#272731] shadow rounded-lg border border-gray-700 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 pl-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar times..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block p-2 w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="block p-2 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="AGENDADO">Agendados</option>
            <option value="AO_VIVO">Ao Vivo</option>
            <option value="FINALIZADO">Finalizados</option>
            <option value="ADIADO">Adiados</option>
          </select>

          <select
            value={filterGrupo}
            onChange={(e) => setFilterGrupo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
            className="block p-2 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="todos">Todos os Grupos</option>
            {campeonato.grupos.map(grupo => (
              <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
            ))}
          </select>

          <select
            value={filterRodada}
            onChange={(e) => setFilterRodada(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))}
            className="block p-2 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="todas">Todas as Rodadas</option>
            {rodadas.map(rodada => (
              <option key={rodada} value={rodada}>{rodada}ª Rodada</option>
            ))}
          </select>

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="block p-2 w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="list">Lista</option>
            <option value="calendar">Calendário</option>
            <option value="table">Tabela</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('')
              setFilterStatus('todos')
              setFilterGrupo('todos')
              setFilterRodada('todas')
            }}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar
          </button>
        </div>
      </div>

      {selectedJogos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-900">
                {selectedJogos.length} jogo(s) selecionado(s)
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('agendar')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Agendar
              </button>
              <button
                onClick={() => handleBulkAction('adiar')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
              >
                Adiar
              </button>
              <button
                onClick={() => handleBulkAction('excluir')}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
              >
                Excluir
              </button>
              <button
                onClick={() => setSelectedJogos([])}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      <JogoManager
        jogos={jogosFiltrados}
        campeonato={campeonato}
        viewMode={viewMode}
        selectedJogos={selectedJogos}
        onSelectionChange={setSelectedJogos}
        onRefresh={refetch}
      />

      {jogosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {estadisticas.total === 0 ? 'Nenhum jogo criado' : 'Nenhum jogo encontrado'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {estadisticas.total === 0
              ? 'Comece gerando os jogos para este campeonato.'
              : 'Ajuste os filtros para ver mais jogos.'
            }
          </p>
          <div className="mt-6">
            {estadisticas.total === 0 ? (
              <button
                onClick={handleGerarJogos}
                disabled={gerarJogosMutation.isPending}
                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:opacity-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                {gerarJogosMutation.isPending ? 'Gerando...' : 'Gerar Jogos'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setFilterStatus('todos')
                  setFilterGrupo('todos')
                  setFilterRodada('todas')
                  setSearchTerm('')
                }}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}