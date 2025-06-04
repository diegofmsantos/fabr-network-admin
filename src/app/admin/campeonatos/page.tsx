"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCampeonatos } from '@/hooks/useCampeonatos'
import { Loading } from '@/components/ui/Loading'
import { Plus, Filter, Search, Download } from 'lucide-react'
import { useDeleteCampeonato } from '@/hooks/useDeleteCampeonato'
import { CampeonatoCard } from '@/components/Admin/CampeonatoCard'

type FilterStatus = 'todos' | 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'FINALIZADO'
type FilterTipo = 'todos' | 'REGULAR' | 'PLAYOFFS' | 'COPA'

export default function AdminCampeonatos() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterTipo, setFilterTipo] = useState<FilterTipo>('todos')
  const [filterTemporada, setFilterTemporada] = useState('2025')

  const { data: campeonatos = [], isLoading, refetch } = useCampeonatos({
    temporada: filterTemporada,
    tipo: filterTipo === 'todos' ? undefined : filterTipo,
    status: filterStatus === 'todos' ? undefined : filterStatus
  })

  const deleteMutation = useDeleteCampeonato()

  // Filtro por busca
  const campeonatosFiltrados = campeonatos.filter(campeonato =>
    campeonato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campeonato.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este campeonato?')) {
      try {
        await deleteMutation.mutateAsync(id)
        refetch()
      } catch (error) {
        alert('Erro ao excluir campeonato')
      }
    }
  }

  const handleExport = () => {
    // Implementar exportação CSV/PDF
    console.log('Exportar campeonatos:', campeonatosFiltrados)
  }

  if (isLoading) return <Loading />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciar Campeonatos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Crie, edite e gerencie todos os campeonatos
          </p>
        </div>
        
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <button
            onClick={handleExport}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          
          <Link
            href="/admin/campeonatos/criar"
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Campeonato
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-0 h-5 w-5 pl-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar campeonatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="todos">Todos os Status</option>
            <option value="NAO_INICIADO">Não Iniciado</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>

          {/* Tipo Filter */}
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as FilterTipo)}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="REGULAR">Regular</option>
            <option value="PLAYOFFS">Playoffs</option>
            <option value="COPA">Copa</option>
          </select>

          {/* Temporada Filter */}
          <select
            value={filterTemporada}
            onChange={(e) => setFilterTemporada(e.target.value)}
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterStatus('todos')
              setFilterTipo('todos')
              setFilterTemporada('2025')
            }}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{campeonatosFiltrados.length}</span> de{' '}
          <span className="font-medium">{campeonatos.length}</span> campeonatos
        </p>
      </div>

      {/* Campeonatos Grid */}
      {campeonatosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Filter className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum campeonato encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ajuste os filtros ou crie um novo campeonato.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/campeonatos/criar"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Campeonato
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campeonatosFiltrados.map((campeonato) => (
            <CampeonatoCard
              key={campeonato.id}
              campeonato={campeonato}
              onEdit={() => router.push(`/admin/campeonatos/${campeonato.id}`)}
              onDelete={() => handleDelete(campeonato.id)}
              onViewDetails={() => router.push(`/campeonato/${campeonato.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}