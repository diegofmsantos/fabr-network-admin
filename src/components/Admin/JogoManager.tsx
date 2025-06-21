"use client"

import { useState, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, Edit, Trash2, Play, Pause, CheckCircle, MapPin, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { Campeonato, Jogo } from '@/types'

interface JogoManagerProps {
  jogos: Jogo[]
  campeonato: Campeonato
  viewMode: 'calendar' | 'list' | 'table'
  selectedJogos: number[]
  onSelectionChange: (ids: number[]) => void
  onRefresh: () => void
}

export const JogoManager: React.FC<JogoManagerProps> = ({ jogos, campeonato, viewMode, selectedJogos, onSelectionChange, onRefresh }) => {
  const [editingJogo, setEditingJogo] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [filterGrupo, setFilterGrupo] = useState<number | 'todos'>('todos')

  const jogosFiltrados = useMemo(() => {
    let filtered = jogos

    if (filterStatus !== 'todos') {
      filtered = filtered.filter(jogo => jogo.status === filterStatus)
    }

    if (filterGrupo !== 'todos') {
      filtered = filtered.filter(jogo => jogo.grupoId === filterGrupo)
    }

    return filtered
  }, [jogos, filterStatus, filterGrupo])

  const jogosPorData = useMemo(() => {
    const grupos = new Map<string, Jogo[]>()
    
    jogosFiltrados.forEach(jogo => {
      const data = format(parseISO(jogo.dataJogo), 'yyyy-MM-dd')
      if (!grupos.has(data)) {
        grupos.set(data, [])
      }
      grupos.get(data)!.push(jogo)
    })

    return grupos
  }, [jogosFiltrados])

  const handleSelectJogo = (jogoId: number) => {
    const newSelection = selectedJogos.includes(jogoId)
      ? selectedJogos.filter(id => id !== jogoId)
      : [...selectedJogos, jogoId]
    
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedJogos.length === jogosFiltrados.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(jogosFiltrados.map(j => j.id))
    }
  }

  const handleUpdateJogo = (jogoId: number, data: Partial<Jogo>) => {
    console.log('Atualizar jogo:', { jogoId, data })
    setEditingJogo(null)
    onRefresh()
  }

  const handleDeleteJogo = (jogoId: number) => {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
      console.log('Excluir jogo:', jogoId)
      onRefresh()
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO': return <Clock className="w-4 h-4 text-blue-600" />
      case 'AO_VIVO': return <Play className="w-4 h-4 text-red-600" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'ADIADO': return <Pause className="w-4 h-4 text-yellow-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'bg-blue-100 text-blue-800'
      case 'AO_VIVO': return 'bg-red-100 text-red-800'
      case 'FINALIZADO': return 'bg-green-100 text-green-800'
      case 'ADIADO': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const JogoCard = ({ jogo }: { jogo: Jogo }) => (
    <div className={`bg-[#272731] rounded-lg border-4 border-gray-700 p-4 hover:shadow-md transition-shadow ${
      selectedJogos.includes(jogo.id) ? 'ring-2 ring-[#63E300]' : ''
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedJogos.includes(jogo.id)}
            onChange={() => handleSelectJogo(jogo.id)}
            className="rounded border-gray-300"
          />
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
            {jogo.rodada}ª Rodada
          </span>
          {jogo.grupo && (
            <span className="text-xs text-gray-300">{jogo.grupo.nome}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center  gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(jogo.status)}`}>
            {getStatusIcon(jogo.status)}
            {jogo.status}
          </span>
          
          <div className="relative">
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreHorizontal className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={ImageService.getTeamLogo(jogo.timeCasa.nome || '')}
              alt={`Logo ${jogo.timeCasa.nome}`}
              width={32}
              height={32}
              onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome || '')}
            />
            <span className="font-medium text-gray-300">{jogo.timeCasa.sigla}</span>
          </div>
          <span className="text-lg font-bold text-gray-300">
            {jogo.placarCasa !== null ? jogo.placarCasa : '-'}
          </span>
        </div>

        <div className="text-center text-gray-400 text-sm">VS</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={ImageService.getTeamLogo(jogo.timeVisitante.nome || '')}
              alt={`Logo ${jogo.timeVisitante.nome}`}
              width={32}
              height={32}
              onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome || '')}
            />
            <span className="font-medium text-gray-300">{jogo.timeVisitante.sigla}</span>
          </div>
          <span className="text-lg font-bold text-gray-300">
            {jogo.placarVisitante !== null ? jogo.placarVisitante : '-'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {format(parseISO(jogo.dataJogo), "dd/MM 'às' HH:mm", { locale: ptBR })}
        </div>
        {jogo.local && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {jogo.local}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
        <button
          onClick={() => setEditingJogo(jogo.id)}
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDeleteJogo(jogo.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderListView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSelectAll}
            className="text-sm text-[#63E300] hover:text-gray-500"
          >
            {selectedJogos.length === jogosFiltrados.length ? 'Desmarcar todos' : 'Selecionar todos'}
          </button>
          {selectedJogos.length > 0 && (
            <span className="text-sm text-gray-300">
              {selectedJogos.length} jogo(s) selecionado(s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm p-2 border-gray-300 rounded"
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
            className="text-sm p-2 border-gray-300 rounded"
          >
            <option value="todos">Todos os Grupos</option>
            {campeonato.grupos.map(grupo => (
              <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jogosFiltrados.map(jogo => (
          <JogoCard key={jogo.id} jogo={jogo} />
        ))}
      </div>
    </div>
  )

  const renderCalendarView = () => (
    <div className="space-y-6">
      {Array.from(jogosPorData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([data, jogosData]) => (
          <div key={data}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {format(parseISO(data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogosData.map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} />
              ))}
            </div>
          </div>
        ))}
    </div>
  )

  const renderTableView = () => (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedJogos.length === jogosFiltrados.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rodada
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Times
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Placar
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data/Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jogosFiltrados.map(jogo => (
            <tr key={jogo.id} className={selectedJogos.includes(jogo.id) ? 'bg-blue-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedJogos.includes(jogo.id)}
                  onChange={() => handleSelectJogo(jogo.id)}
                  className="rounded border-gray-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {jogo.rodada}ª
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {jogo.timeCasa.sigla} vs {jogo.timeVisitante.sigla}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {jogo.placarCasa !== null && jogo.placarVisitante !== null 
                  ? `${jogo.placarCasa} - ${jogo.placarVisitante}`
                  : '-'
                }
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(parseISO(jogo.dataJogo), "dd/MM/yy HH:mm")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(jogo.status)}`}>
                  {getStatusIcon(jogo.status)}
                  {jogo.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingJogo(jogo.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJogo(jogo.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      {viewMode === 'list' && renderListView()}
      {viewMode === 'calendar' && renderCalendarView()}
      {viewMode === 'table' && renderTableView()}
      
      {jogosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhum jogo encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Ajuste os filtros ou crie novos jogos.
          </p>
        </div>
      )}
    </div>
  )
}