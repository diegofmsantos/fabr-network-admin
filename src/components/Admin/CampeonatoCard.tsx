import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trophy, Calendar, Play, Edit, Trash2, Eye, CheckCircle, Clock, Pause } from 'lucide-react'
import { Campeonato } from '@/types'

interface CampeonatoCardProps {
  campeonato: Campeonato
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
}

export const CampeonatoCard: React.FC<CampeonatoCardProps> = ({ campeonato, onEdit, onDelete, onViewDetails }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO':
        return <Clock className="w-4 h-4" />
      case 'EM_ANDAMENTO':
        return <Play className="w-4 h-4" />
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Pause className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO':
        return 'bg-gray-100 text-gray-800'
      case 'EM_ANDAMENTO':
        return 'bg-green-100 text-green-800'
      case 'FINALIZADO':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'REGULAR':
        return <Trophy className="w-5 h-5" />
      case 'PLAYOFFS':
        return <Play className="w-5 h-5" />
      case 'COPA':
        return <Trophy className="w-5 h-5" />
      default:
        return <Trophy className="w-5 h-5" />
    }
  }

  const getTotalTimes = () => {
    return campeonato.grupos?.reduce((acc, grupo) => acc + grupo.times.length, 0) || 0
  }

  const getTotalJogos = () => {
    return campeonato._count?.jogos || 0
  }

  const getProgresso = () => {
    const total = getTotalJogos()
    if (total === 0) return 0
    return 0
  }

  return (
    <div className="bg-[#272731] overflow-hidden shadow rounded-lg hover:shadow-xl border border-gray-700 transition-shadow duration-200">
      <div className="bg-[#1C1C24] px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 text-[#63E300]">
              {getTipoIcon(campeonato.tipo)}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white truncate">
                {campeonato.nome}
              </h3>
              <p className="text-sm text-gray-400">
                {campeonato.temporada} • {campeonato.tipo}
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campeonato.status)}`}>
            {getStatusIcon(campeonato.status)}
            <span className="ml-1">{getStatusText(campeonato.status)}</span>
          </span>
        </div>
      </div>

      <div className="px-6 py-4">
        {campeonato.descricao && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">
            {campeonato.descricao}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#63E300]">{campeonato.grupos?.length || 0}</div>
            <div className="text-xs text-gray-400">Grupos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{getTotalTimes()}</div>
            <div className="text-xs text-gray-400">Times</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{getTotalJogos()}</div>
            <div className="text-xs text-gray-400">Jogos</div>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-400 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(campeonato.dataInicio), "dd 'de' MMM", { locale: ptBR })}
            {campeonato.dataFim && (
              <> - {format(new Date(campeonato.dataFim), "dd 'de' MMM", { locale: ptBR })}</>
            )}
          </span>
        </div>

        {campeonato.status === 'EM_ANDAMENTO' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progresso</span>
              <span>{getProgresso()}%</span>
            </div>
            <div className="w-full bg-[#1C1C24] rounded-full h-2">
              <div
                className="bg-[#63E300] h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgresso()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1C1C24] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onViewDetails}
              className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-[#272731] hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#63E300] transition-colors"
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-black bg-[#63E300] hover:bg-[#50B800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#63E300] transition-colors"
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </button>
          </div>

          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-300 bg-red-900/30 hover:bg-red-800/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Excluir
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Criado em {format(new Date(campeonato.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
            <span>ID: {campeonato.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}