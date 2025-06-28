"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Trophy, Users, Calendar, Eye, Settings, AlertTriangle, Download } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useTemporadas, useSuperliga } from '@/hooks/useSuperliga'

// Tipagens corretas baseadas no backend
interface TemporadaInfo {
  temporada: string
  status: string
  dataInicio: string
  dataFim?: string
  _count: {
    jogos: number
    conferencias: number
  }
}

interface SuperligaData {
  id: number
  nome: string
  temporada: string
  status: string
  dataInicio: string
  dataFim?: string
  descricao?: string
  isSuperliga: boolean
  configSuperliga?: any
  conferencias?: any[]
  _count?: {
    jogos: number
    conferencias: number
  }
}

export default function AdminSuperligaPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTemporada, setFilterTemporada] = useState('2025')

  const { data: temporadas, isLoading: loadingTemporadas } = useTemporadas()
  const { data: superliga, isLoading: loadingSuperliga, error } = useSuperliga(filterTemporada)

  if (loadingTemporadas || loadingSuperliga) {
    return <Loading />
  }

  // Tipagem correta para temporadas
  const temporadasDisponiveis = temporadas ? 
    (temporadas as TemporadaInfo[]).map(t => t.temporada) : 
    ['2025']

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">
        Nenhuma Superliga encontrada para {filterTemporada}
      </h3>
      <p className="text-gray-400 mb-6">
        Crie uma nova Superliga para começar a gerenciar o campeonato
      </p>
      <Link
        href="/admin/superliga/criar"
        className="inline-flex items-center bg-[#63E300] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
      >
        <Plus className="w-5 h-5 mr-2" />
        Criar Superliga {filterTemporada}
      </Link>
    </div>
  )

  const renderSuperligaCard = () => {
    if (!superliga) return renderEmptyState()

    const superligaData = superliga as SuperligaData

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'NAO_INICIADO': return 'bg-gray-500'
        case 'EM_ANDAMENTO': return 'bg-blue-500'
        case 'FINALIZADO': return 'bg-green-500'
        default: return 'bg-gray-500'
      }
    }

    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'NAO_INICIADO': return 'Não Iniciado'
        case 'EM_ANDAMENTO': return 'Em Andamento'
        case 'FINALIZADO': return 'Finalizado'
        default: return status
      }
    }

    return (
      <div className="bg-[#272731] rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              {superligaData.nome}
            </h3>
            <p className="text-gray-400">Temporada {superligaData.temporada}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(superligaData.status)}`}>
              {getStatusLabel(superligaData.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">32</p>
            <p className="text-sm text-gray-400">Times</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">
              {superligaData._count?.conferencias || 4}
            </p>
            <p className="text-sm text-gray-400">Conferências</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#63E300]">8</p>
            <p className="text-sm text-gray-400">Regionais</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/superliga/${superligaData.id}`}
            className="flex items-center gap-2 bg-[#63E300] text-black px-4 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors"
          >
            <Settings className="w-4 h-4" />
            Gerenciar
          </Link>
          
          <Link
            href={`/admin/superliga/${superligaData.id}/status`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Status
          </Link>

          <Link
            href={`/admin/superliga/${superligaData.id}/playoffs`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Playoffs
          </Link>

          <Link
            href={`/superliga/${superligaData.temporada}`}
            className="flex items-center gap-2 bg-[#1C1C24] text-white px-4 py-2 rounded-md border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Superliga de Futebol Americano</h1>
          <p className="mt-1 text-sm text-gray-400">
            Gerencie a estrutura e funcionamento da Superliga
          </p>
        </div>

        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Link
            href="/admin/superliga/criar"
            className="inline-flex items-center rounded-md bg-[#63E300] px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-[#50B800] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Superliga
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-[#272731] shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full sm:w-48">
            <select
              value={filterTemporada}
              onChange={(e) => setFilterTemporada(e.target.value)}
              className="w-full px-3 py-2 bg-[#1C1C24] text-white rounded-md border border-gray-700 focus:border-[#63E300] focus:outline-none"
            >
              {temporadasDisponiveis.map((temp: string) => (
                <option key={temp} value={temp}>{temp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-[#272731] shadow rounded-lg p-6">
        {error ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Erro ao carregar Superliga</h3>
            <p className="text-gray-400 mb-6">{(error as Error)?.message || 'Erro desconhecido'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#63E300] text-black px-6 py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          renderSuperligaCard()
        )}
      </div>
    </div>
  )
}