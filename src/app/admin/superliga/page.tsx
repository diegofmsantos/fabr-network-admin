// src/app/admin/superliga/page.tsx
"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Trophy, 
  Plus, 
  Calendar, 
  Users, 
  Play, 
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'
import { useCampeonatos } from '@/hooks/useCampeonatos'
import { Loading } from '@/components/ui/Loading'
import { useCriarSuperliga } from '@/hooks/useSuperliga'

export default function SuperligaPage() {
  const router = useRouter()
  const [filtroTemporada, setFiltroTemporada] = useState<string>('todas')
  const [isCreating, setIsCreating] = useState(false)

  // Buscar apenas Superligas (isSuperliga: true)
  const { data: superligas = [], isLoading, refetch } = useCampeonatos({
    filters: { isSuperliga: true }
  })

  const { mutate: criarSuperliga, isPending } = useCriarSuperliga()

  // Filtrar por temporada
  const superligasFiltradas = superligas.filter(superliga => {
    if (filtroTemporada === 'todas') return true
    return superliga.temporada === filtroTemporada
  })

  // Temporadas disponíveis
  const temporadas = [...new Set(superligas.map(s => s.temporada))].sort((a, b) => b.localeCompare(a))

  const handleCriarSuperliga = () => {
    setIsCreating(true)
    const anoAtual = new Date().getFullYear()
    const proximoAno = anoAtual + 1
    
    criarSuperliga(proximoAno.toString(), {
      onSuccess: (novaSuperlgia) => {
        setIsCreating(false)
        router.push(`/admin/superliga/${novaSuperlgia.id}`)
      },
      onError: () => {
        setIsCreating(false)
      }
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO':
        return <Clock className="w-4 h-4" />
      case 'EM_ANDAMENTO':
        return <Play className="w-4 h-4" />
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO':
        return 'Não Iniciado'
      case 'EM_ANDAMENTO':
        return 'Em Andamento'
      case 'FINALIZADO':
        return 'Finalizado'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO':
        return 'bg-gray-500'
      case 'EM_ANDAMENTO':
        return 'bg-blue-500'
      case 'FINALIZADO':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#63E300] italic tracking-[-2px] mb-2">
              🏆 SUPERLIGA DE FUTEBOL AMERICANO
            </h1>
            <p className="text-gray-400">
              Gerencie todas as edições da Superliga de Futebol Americano do Brasil
            </p>
          </div>

          <button
            onClick={handleCriarSuperliga}
            disabled={isPending || isCreating}
            className="inline-flex items-center rounded-md bg-[#63E300] px-4 py-3 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isPending || isCreating ? 'Criando...' : 'Criar Nova Superliga 2025'}
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#272731] rounded-lg p-4 mb-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filtrar por Temporada
            </label>
            <select
              value={filtroTemporada}
              onChange={(e) => setFiltroTemporada(e.target.value)}
              className="w-full bg-[#1C1C24] border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#63E300]"
            >
              <option value="todas">Todas as Temporadas</option>
              {temporadas.map(temporada => (
                <option key={temporada} value={temporada}>
                  {temporada}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Superligas */}
      {superligasFiltradas.length === 0 ? (
        <div className="bg-[#272731] rounded-lg border border-gray-700 p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {superligas.length === 0 ? 'Nenhuma Superliga criada ainda' : 'Nenhuma Superliga encontrada'}
          </h3>
          <p className="text-gray-400 mb-6">
            {superligas.length === 0 
              ? 'Crie a primeira edição da Superliga de Futebol Americano'
              : 'Ajuste os filtros ou crie uma nova Superliga'
            }
          </p>
          {superligas.length === 0 && (
            <button
              onClick={handleCriarSuperliga}
              disabled={isPending || isCreating}
              className="inline-flex items-center rounded-md bg-[#63E300] px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isPending || isCreating ? 'Criando...' : 'Criar Primeira Superliga'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {superligasFiltradas.map((superliga) => (
            <Link
              key={superliga.id}
              href={`/admin/superliga/${superliga.id}`}
              className="block group"
            >
              <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-[#63E300] transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px]">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-[#63E300] bg-opacity-20 rounded-lg mr-3">
                      <Trophy className="w-6 h-6 text-[#63E300]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white leading-tight">
                        {superliga.nome}
                      </h3>
                      <p className="text-sm text-gray-400">{superliga.temporada}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs text-white flex items-center gap-1 ${getStatusColor(superliga.status)}`}>
                    {getStatusIcon(superliga.status)}
                    {getStatusText(superliga.status)}
                  </span>
                </div>

                {/* Informações das Conferências */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-400">
                      <span className="mr-1">🏭</span>
                      <span>Sudeste (12)</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="mr-1">🧊</span>
                      <span>Sul (8)</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="mr-1">🌵</span>
                      <span>Nordeste (6)</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <span className="mr-1">🌲</span>
                      <span>Centro-Norte (6)</span>
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {new Date(superliga.dataInicio).toLocaleDateString('pt-BR')}
                      {superliga.dataFim && (
                        <> - {new Date(superliga.dataFim).toLocaleDateString('pt-BR')}</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>32 times • 4 conferências • 8 regionais</span>
                  </div>
                  
                  {superliga._count && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Play className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{superliga._count.jogos || 0} jogos</span>
                    </div>
                  )}
                </div>

                {/* Descrição */}
                {superliga.descricao && (
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {superliga.descricao}
                  </p>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Última atualização: {new Date(superliga.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-[#63E300] group-hover:text-white transition-colors">
                      Gerenciar →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Estatísticas Gerais */}
      {superligas.length > 0 && (
        <div className="mt-8 bg-[#272731] rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas Gerais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#63E300]">{superligas.length}</div>
              <div className="text-sm text-gray-400">Superligas Criadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {superligas.filter(s => s.status === 'EM_ANDAMENTO').length}
              </div>
              <div className="text-sm text-gray-400">Em Andamento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {superligas.filter(s => s.status === 'FINALIZADO').length}
              </div>
              <div className="text-sm text-gray-400">Finalizadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {superligas.reduce((acc, s) => acc + (s._count?.jogos || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Total de Jogos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}