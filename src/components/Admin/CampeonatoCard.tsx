// src/components/Admin/CampeonatoCard.tsx
import React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Trophy, 
  Calendar, 
  Users, 
  Play, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  Clock,
  Pause
} from 'lucide-react'
import { Campeonato } from '@/types/campeonato'

interface CampeonatoCardProps {
  campeonato: Campeonato
  onEdit: () => void
  onDelete: () => void
  onViewDetails: () => void
}

export const CampeonatoCard: React.FC<CampeonatoCardProps> = ({
  campeonato,
  onEdit,
  onDelete,
  onViewDetails
}) => {
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
    // Aqui você poderia calcular jogos finalizados vs total
    return 0
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      {/* Header do Card */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getTipoIcon(campeonato.tipo)}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {campeonato.nome}
              </h3>
              <p className="text-sm text-gray-500">
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

      {/* Conteúdo Principal */}
      <div className="px-6 py-4">
        {/* Descrição */}
        {campeonato.descricao && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {campeonato.descricao}
          </p>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{campeonato.grupos?.length || 0}</div>
            <div className="text-xs text-gray-500">Grupos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{getTotalTimes()}</div>
            <div className="text-xs text-gray-500">Times</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{getTotalJogos()}</div>
            <div className="text-xs text-gray-500">Jogos</div>
          </div>
        </div>

        {/* Datas */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {format(new Date(campeonato.dataInicio), "dd 'de' MMM", { locale: ptBR })}
            {campeonato.dataFim && (
              <> - {format(new Date(campeonato.dataFim), "dd 'de' MMM", { locale: ptBR })}</>
            )}
          </span>
        </div>

        {/* Barra de Progresso */}
        {campeonato.status === 'EM_ANDAMENTO' && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progresso</span>
              <span>{getProgresso()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgresso()}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer com Ações */}
      <div className="bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onViewDetails}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Eye className="w-3 h-3 mr-1" />
              Ver
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </button>
          </div>

          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Excluir
          </button>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Criado em {format(new Date(campeonato.createdAt), "dd/MM/yyyy", { locale: ptBR })}</span>
            <span>ID: {campeonato.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}